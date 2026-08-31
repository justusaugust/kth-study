import type { ElementType } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export function MathText({
  children,
  as: Wrapper = "span",
  className,
}: {
  children: string;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Wrapper className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{ p: ({ children: content }) => <>{content}</> }}
      >
        {children}
      </ReactMarkdown>
    </Wrapper>
  );
}
