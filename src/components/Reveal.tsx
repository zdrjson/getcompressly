import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

interface Props {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}

// Fades its children up the first time they scroll into view. Content is in
// the DOM from the start (crawlers and no-JS readers see it); only the
// transition waits for the observer.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
