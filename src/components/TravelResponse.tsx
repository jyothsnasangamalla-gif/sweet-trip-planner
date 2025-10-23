import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface TravelResponseProps {
  content: string;
  isStreaming: boolean;
}

export const TravelResponse = ({ content, isStreaming }: TravelResponseProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isStreaming) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  if (!content) return null;

  return (
    <Card className="w-full max-w-2xl p-8 shadow-soft border-2 bg-card/95 backdrop-blur-sm">
      <div 
        ref={scrollRef}
        className="prose prose-lg max-w-none overflow-y-auto max-h-[600px] scroll-smooth"
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-primary">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-primary">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-secondary">{children}</h3>,
            p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
            ul: ({ children }) => <ul className="mb-4 space-y-2">{children}</ul>,
            li: ({ children }) => <li className="text-foreground">{children}</li>,
            strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
        {isStreaming && (
          <span className="inline-block w-2 h-5 ml-1 bg-primary animate-pulse" />
        )}
      </div>
    </Card>
  );
};
