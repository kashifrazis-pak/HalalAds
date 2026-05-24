/**
 * TC-U-010 to TC-U-015
 * Unit tests for lib/blog.ts — MDX post helpers
 */
import { getAllPosts, getPost } from "@/lib/blog";

describe("getAllPosts()", () => {
  it("TC-U-010: returns an array", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("TC-U-011: each post has required frontmatter fields", () => {
    const posts = getAllPosts();
    posts.forEach((post) => {
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("description");
      expect(post).toHaveProperty("date");
      expect(post).toHaveProperty("author");
      expect(post).toHaveProperty("category");
      expect(post).toHaveProperty("readTime");
    });
  });

  it("TC-U-012: posts are sorted newest first", () => {
    const posts = getAllPosts();
    if (posts.length >= 2) {
      const dates = posts.map((p) => new Date(p.date).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    }
  });

  it("TC-U-013: returns at least 2 posts (the seeded blog posts)", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(2);
  });
});

describe("getPost()", () => {
  it("TC-U-014: returns full post content for a valid slug", () => {
    const post = getPost("halal-advertising-muslim-market-guide");
    expect(post).not.toBeNull();
    expect(post?.content).toBeTruthy();
    expect(post?.slug).toBe("halal-advertising-muslim-market-guide");
  });

  it("TC-U-015: returns null for a non-existent slug", () => {
    const post = getPost("this-post-does-not-exist");
    expect(post).toBeNull();
  });

  it("TC-U-016: returned post includes all metadata fields", () => {
    const post = getPost("halal-advertising-muslim-market-guide");
    expect(post?.title).toBeTruthy();
    expect(post?.description).toBeTruthy();
    expect(post?.category).toBeTruthy();
  });
});
