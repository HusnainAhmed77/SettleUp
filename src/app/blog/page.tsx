'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, BookOpen, Tag } from "lucide-react";
import Image from "next/image";
import { blogService, BlogPost, BlogCategory } from "@/services/blogService";

export const dynamic = 'force-dynamic';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const [postsData, categoriesData] = await Promise.all([
          blogService.getAllPosts(),
          blogService.getCategories()
        ]);
        
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen relative">
      {/* Facets Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Magenta Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF007F]/10 via-transparent to-[#00CFFF]/10 z-0"></div>

      <div className="relative z-10">
        {/* Search Section */}
        <div className="border-b border-gray-200/30 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-32 rounded-lg border-2 border-[#FF007F] hover:border-[#00CFFF] focus:border-[#00CFFF] focus:outline-none text-[#333333] text-lg transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#FF007F] hover:bg-[#00CFFF] text-white font-semibold rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                {/* Resources Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-[#FF007F]" />
                    <h3 className="font-bold text-[#333333]">Resources</h3>
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/blog" className="text-[#FF007F] hover:text-[#00CFFF] font-medium transition-colors">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="text-[#666666] hover:text-[#FF007F] transition-colors">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Categories Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-[#FF007F]" />
                    <h3 className="font-bold text-[#333333]">Categories</h3>
                  </div>
                  <ul className="space-y-2">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <li key={i}>
                          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        </li>
                      ))
                    ) : (
                      categories.map((category) => (
                        <li key={category.$id}>
                          <button
                            onClick={() => setSelectedCategory(category.name)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              selectedCategory === category.name
                                ? "bg-[#FF007F] text-white font-medium"
                                : "text-[#666666] hover:bg-gray-100 hover:text-[#FF007F]"
                            }`}
                          >
                            {category.name}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Blog Posts Grid */}
            <main className="flex-1">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.$id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          {/* Image */}
                          <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                            {post.image_url ? (
                              <Image
                                src={post.image_url}
                                alt={post.title}
                                width={400}
                                height={192}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF007F]/20 to-[#4A90E2]/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <BookOpen className="w-10 h-10 text-white" />
                                  </div>
                                </div>
                              </>
                            )}
                            {/* Category Badge */}
                            {post.category && (
                              <div className="absolute top-4 left-4 z-10">
                                <span className="px-3 py-1 bg-[#FF007F] text-white text-xs font-semibold rounded-full">
                                  {post.category}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6 flex-1 flex flex-col">
                            {/* Title */}
                            <h2 className="text-lg font-bold text-[#333333] mb-3 group-hover:text-[#FF007F] transition-colors line-clamp-2">
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            {post.excerpt && (
                              <p className="text-sm text-[#666666] mb-4 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Read More Button */}
                            <div className="mt-auto">
                              <button className="w-full px-4 py-2 bg-[#FF007F] hover:bg-[#00CFFF] text-white font-semibold rounded-lg transition-colors">
                                Read more
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>

              {/* No Results */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-[#666666] text-lg">No posts found matching your criteria.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
