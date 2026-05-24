import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/blog";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Halal Advertising Insights",
  description:
    "Guides, insights, and research on advertising to Muslim consumers, monetising halal websites, and the global Islamic economy.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-hero pt-32 pb-20">
          <div className="container-brand text-center max-w-2xl mx-auto">
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              The Islamic Ad Network <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-white/75 text-lg">
              Insights on the Muslim market, halal advertising, and how to grow your brand across the Islamic world.
            </p>
          </div>
        </section>

        <section className="py-20 bg-brand-cream">
          <div className="container-brand">
            {/* Featured post */}
            {featured && (
              <div className="mb-14">
                <p className="text-xs font-bold text-brand-gold tracking-widest uppercase mb-5">Featured</p>
                <Link href={`/blog/${featured.slug}`} className="block group">
                  <div className="card-brand p-8 sm:p-10 grid sm:grid-cols-2 gap-8 items-center">
                    <div className="bg-gradient-brand aspect-video rounded-2xl flex items-center justify-center">
                      <span className="font-display text-5xl text-white/20 font-bold">{featured.category[0]}</span>
                    </div>
                    <div>
                      <span className="badge-gold mb-4">{featured.category}</span>
                      <h2 className="font-display text-2xl font-bold text-brand-charcoal mt-3 mb-3 group-hover:text-brand-green transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-brand-muted text-sm leading-relaxed mb-5">{featured.description}</p>
                      <div className="flex items-center gap-4 text-xs text-brand-muted">
                        <span className="flex items-center gap-1"><Clock size={12} />{featured.readTime}</span>
                        <span>{featured.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-brand-green text-sm font-semibold mt-5 group-hover:gap-2 transition-all">
                        Read article <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* All posts */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block card-brand p-6">
                  <div className="bg-gradient-brand aspect-video rounded-xl mb-5 flex items-center justify-center">
                    <span className="font-display text-4xl text-white/20 font-bold">{post.category[0]}</span>
                  </div>
                  <span className="badge-green mb-3">{post.category}</span>
                  <h3 className="font-display font-bold text-brand-charcoal mt-3 mb-2 group-hover:text-brand-green transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-4 line-clamp-3">{post.description}</p>
                  <div className="flex items-center gap-3 text-xs text-brand-muted">
                    <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
