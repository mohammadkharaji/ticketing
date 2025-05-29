import React, { FC } from "react";

interface ArticleDetailProps {
  article: {
    id: string;
    title: string;
    content: string;
    author?: string;
    createdAt: string;
    updatedAt?: string;
  };
}

const ArticleDetail: FC<ArticleDetailProps> = ({ article }) => {
  return (
    <div className="max-w-2xl mx-auto bg-card rounded shadow p-6">
      <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
      <div className="text-sm text-muted-foreground mb-4">
        {article.author && <span>نویسنده: {article.author} | </span>}
        <span>تاریخ ایجاد: {new Date(article.createdAt).toLocaleDateString("fa-IR")}</span>
        {article.updatedAt && (
          <span> | آخرین ویرایش: {new Date(article.updatedAt).toLocaleDateString("fa-IR")}</span>
        )}
      </div>
      <div className="prose prose-sm max-w-none rtl" dir="rtl">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
};

export default ArticleDetail;
