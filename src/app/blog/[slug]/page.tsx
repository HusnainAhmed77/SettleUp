'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { blogService, BlogPost } from '@/services/blogService';

export const dynamic = 'force-dynamic';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostData() {
      try {
        const [postData, allPosts] = await Promise.all([
          blogService.getPostBySlug(slug),
          blogService.getAllPosts()
        ]);
        
        setPost(postData);
        
        // Get related posts (exclude current post, limit to 2)
        if (postData) {
          const related = allPosts
            .filter(p => p.slug !== slug)
            .slice(0, 2);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed inset-0 z-0 opacity-30">
          <Image
            src="/images/facets.png"
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10">
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#333333] mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-[#FF007F] hover:text-[#00CFFF] font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Facets Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#666666] hover:text-[#FF007F] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Container */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Category Badge */}
              {post.category && (
                <div className="px-8 pt-8">
                  <span className="inline-block px-4 py-2 bg-[#FF007F] text-white text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Article Header */}
              <div className="px-8 pt-6 pb-8 border-b border-gray-200">
                <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-[#666666] text-sm">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  )}
                  {post.published_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.published_date)}</span>
                    </div>
                  )}
                  {post.read_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF007F] font-medium">{post.read_time}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="px-8 py-12">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-[#333333] prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-[#666666] prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-[#666666] prose-ul:my-6 prose-li:mb-2 prose-strong:text-[#333333] prose-strong:font-semibold prose-a:text-[#FF007F] prose-a:no-underline hover:prose-a:text-[#00CFFF]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag className="w-5 h-5 text-[#666666]" />
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-200 text-[#666666] text-sm rounded-full hover:border-[#FF007F] hover:text-[#FF007F] transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio */}
              {post.author && post.author_bio && (
                <div className="px-8 py-8 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF007F] to-[#4A90E2] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {post.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#333333] mb-2">{post.author}</h3>
                      <p className="text-[#666666] leading-relaxed">{post.author_bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-16"
              >
                <h2 className="text-3xl font-bold text-[#333333] mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.$id} href={`/blog/${relatedPost.slug}`}>
                      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <div className="p-6 flex flex-col flex-1">
                          {relatedPost.category && (
                            <span className="inline-block px-3 py-1 bg-[#FF007F] text-white text-xs font-semibold rounded-full mb-3 w-fit">
                              {relatedPost.category}
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[#FF007F] transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          {relatedPost.excerpt && (
                            <p className="text-[#666666] text-sm mb-4 line-clamp-3 flex-1">
                              {relatedPost.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-[#999999] mt-auto">
                            {relatedPost.published_date && <span>{formatDate(relatedPost.published_date)}</span>}
                            {relatedPost.read_time && (
                              <>
                                <span>•</span>
                                <span>{relatedPost.read_time}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
