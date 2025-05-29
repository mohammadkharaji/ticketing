import React, { FC, useState } from "react";

interface ArticleFormProps {
  initialValues?: {
    title?: string;
    content?: string;
  };
  onSubmit: (values: { title: string; content: string }) => void;
  loading?: boolean;
}

const ArticleForm: FC<ArticleFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [content, setContent] = useState(initialValues?.content || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block mb-1 font-medium">عنوان مقاله</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">متن مقاله</label>
        <textarea
          className="input input-bordered w-full min-h-[180px]"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "در حال ثبت..." : "ثبت مقاله"}
      </button>
    </form>
  );
};

export default ArticleForm;
