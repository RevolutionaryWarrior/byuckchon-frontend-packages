import dompurify from "dompurify";

export const SanitizeHtml = ({ content }: { content: string }) => {
  return dompurify.sanitize(content);
};
