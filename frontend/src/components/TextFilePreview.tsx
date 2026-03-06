import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function getTextType(url: string, fileName?: string): "md" | "txt" | "csv" | null {
  const name = (fileName || url).toLowerCase();
  if (name.endsWith(".md")) return "md";
  if (name.endsWith(".txt")) return "txt";
  if (name.endsWith(".csv")) return "csv";
  return null;
}

export function isTextFile(url: string, fileName?: string): boolean {
  return getTextType(url, fileName) !== null;
}

export default function TextFilePreview({
  url,
  fileName,
  className = "",
}: {
  url: string;
  fileName?: string;
  className?: string;
}) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const type = getTextType(url, fileName);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.text();
      })
      .then((text) => { if (!cancelled) setContent(text); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [url]);

  if (error) {
    return (
      <div className={`flex items-center justify-center text-muted-foreground text-sm ${className}`}>
        Could not load file preview.{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
          Open file
        </a>
      </div>
    );
  }

  if (content === null) {
    return (
      <div className={`flex items-center justify-center text-muted-foreground text-sm animate-pulse ${className}`}>
        Loading preview...
      </div>
    );
  }

  if (type === "md") {
    return (
      <div className={`overflow-auto p-4 prose prose-sm dark:prose-invert max-w-none ${className}`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  return (
    <pre className={`overflow-auto p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono text-foreground/80 ${className}`}>
      {content}
    </pre>
  );
}
