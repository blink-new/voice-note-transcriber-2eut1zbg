import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
  compact?: boolean
}

export function MarkdownRenderer({ content, className, compact = false }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose prose-warm max-w-none",
      compact ? "prose-sm" : "prose-base",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with warm styling
          h1: ({ children }) => (
            <h1 className="text-2xl font-serif font-semibold text-foreground mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-serif font-semibold text-foreground mb-3 mt-5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-serif font-medium text-foreground mb-2 mt-4 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-serif font-medium text-foreground mb-2 mt-3 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-serif font-medium text-foreground mb-2 mt-3 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-serif font-medium text-muted-foreground mb-2 mt-3 first:mt-0">
              {children}
            </h6>
          ),

          // Paragraphs with proper spacing
          p: ({ children }) => (
            <p className={cn(
              "text-foreground/90 leading-relaxed mb-4 last:mb-0",
              compact ? "text-sm" : "text-base"
            )}>
              {children}
            </p>
          ),

          // Strong text with warm accent
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          // Emphasized text
          em: ({ children }) => (
            <em className="italic text-foreground/90">
              {children}
            </em>
          ),

          // Lists with warm styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={cn(
              "text-foreground/90",
              compact ? "text-sm" : "text-base"
            )}>
              {children}
            </li>
          ),

          // Checkboxes/task lists with warm styling
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 rounded border-primary/30 text-primary focus:ring-primary/20"
                  {...props}
                />
              )
            }
            return <input type={type} {...props} />
          },

          // Code blocks with warm background
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-amber-50/80 text-amber-900 rounded text-sm font-mono">
                  {children}
                </code>
              )
            }
            return (
              <code className={className}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-amber-50/80 border border-amber-100 rounded-lg p-4 mb-4 overflow-x-auto">
              {children}
            </pre>
          ),

          // Blockquotes with warm accent
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-2 mb-4 bg-amber-50/30 rounded-r">
              <div className="text-foreground/80 italic">
                {children}
              </div>
            </blockquote>
          ),

          // Links with warm styling
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary-600 underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-6" />
          ),

          // Tables with warm styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-amber-50/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-amber-100/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-medium text-foreground border border-amber-100/50">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-foreground/90 border border-amber-100/50">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}