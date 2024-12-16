import DOMPurify from "dompurify";

const ContentViewer = ({ content }) => {
  // Sanitize the content to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className="prose prose-sm max-w-none p-2"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    ></div>
  );
};

export default ContentViewer;
