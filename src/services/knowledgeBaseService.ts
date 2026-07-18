const knowledgeBaseService = {
  async getArticles(search?: string) {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/knowledge-base${qs}`, { credentials: "include" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || data || [];
  },

  async getArticle(id: string) {
    const res = await fetch(`/api/knowledge-base?id=${encodeURIComponent(id)}`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`/api/knowledge-base?categories=1`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },

  async createArticle(payload: {
    title: string;
    summary?: string;
    content: string;
    categoryId?: string;
    categoryName?: string;
    tags?: string[];
  }) {
    const res = await fetch("/api/knowledge-base", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("خطا در ایجاد مقاله");
    return res.json();
  },
};

export default knowledgeBaseService;
