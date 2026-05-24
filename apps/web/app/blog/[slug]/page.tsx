import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllPosts, getPost } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Clock } from "lucide-react";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-gradient-hero pt-32 pb-16">
          <div className="container-brand max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={15} /> Back to Blog
            </Link>
            <span className="badge-gold mb-4">{post.category}</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mt-4 mb-5 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-5 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><Clock size={14} />{post.readTime}</span>
              <span>{post.date}</span>
              <span>By {post.author}</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="container-brand">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12 max-w-5xl mx-auto">
              <article className="prose prose-lg prose-headings:font-display prose-headings:text-brand-charcoal prose-p:text-brand-muted prose-a:text-brand-green prose-strong:text-brand-charcoal prose-li:text-brand-muted max-w-none">
                <MDXRemote source={post.content} />
              </article>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 flex flex-col gap-6">
                  <div className="card-brand p-6">
                    <h3 className="font-display font-bold text-brand-charcoal mb-3">
                      Ready to advertise?
                    </h3>
                    <p className="text-brand-muted text-sm mb-4">
                      Join the waitlist for early access and founding rates.
                    </p>
                    <Link href="/waitlist?type=advertiser" className="btn-primary text-sm w-full justify-center">
                      Get Started
                    </Link>
                  </div>
                  <div className="card-brand p-6">
                    <h3 className="font-display font-bold text-brand-charcoal mb-3">
                      Own a halal website?
                    </h3>
                    <p className="text-brand-muted text-sm mb-4">
                      Earn 70% revenue share with halal-only ads.
                    </p>
                    <Link href="/waitlist?type=publisher" className="btn-outline text-sm w-full justify-center">
                      Apply as Publisher
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
