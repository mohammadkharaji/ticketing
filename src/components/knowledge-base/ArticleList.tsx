import React from "react";
import { FC } from "react";

interface ArticleListProps {
  articles: {
    id: string;
    title: string;
    author?: string;
    createdAt: string;
  }[];
  onArticleClick?: (id: string) => void;
}

const ArticleList: FC<ArticleListProps> = ({ articles, onArticleClick }) => {
  if (!articles.length) {
    return <div className="text-center text-muted-foreground py-8">هیچ مقاله‌ای یافت نشد.</div>;
  }
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className="p-4 bg-card rounded shadow hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => onArticleClick?.(article.id)}
          role={onArticleClick ? "button" : undefined}
          tabIndex={onArticleClick ? 0 : undefined}
          aria-label={article.title}
        >
          <h2 className="text-lg font-bold mb-1">{article.title}</h2>
          <div className="text-xs text-muted-foreground">
            {article.author && <span>نویسنده: {article.author} | </span>}
            <span>تاریخ ایجاد: {new Date(article.createdAt).toLocaleDateString("fa-IR")}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
