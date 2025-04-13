'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR, { mutate } from 'swr';
import { PostCard } from '@/components/post-card';
import { Header } from '@/components/header';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/posts', fetcher);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Optimistic UI update
      const previousData = data;
      mutate(
        '/api/posts',
        {
          ...data,
          posts: data.posts.filter((post: any) => post._id !== id),
        },
        false
      );

      // Send delete request to API
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // If delete fails, revert the optimistic update
        mutate('/api/posts', previousData, false);
        throw new Error('Failed to delete post');
      }

      // Revalidate the data
      mutate('/api/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Staggered animation for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-pattern">
        <Header />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="mb-4"
            >
              <Loader2 className="h-12 w-12 text-primary" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-medium"
            >
              Loading your AI-generated content...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ai-pattern">
        <Header />
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 max-w-md mx-auto text-center"
          >
            <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Content</h2>
            <p className="text-muted-foreground">
              We couldn't connect to the database. Please try again later or contact support if the problem persists.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <div className="min-h-screen ai-pattern">
      <Header />
      
      <main className="container mx-auto px-4 pb-12">
        {posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[40vh] text-center"
          >
            <div className="bg-muted/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 max-w-md">
              <h2 className="text-2xl font-bold mb-2">No Content Found</h2>
              <p className="text-muted-foreground">
                There are no AI-generated posts in your database yet.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {posts.map((post: any) => (
                <motion.div
                  key={post._id}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <PostCard
                    post={post}
                    onDelete={handleDeletePost}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
