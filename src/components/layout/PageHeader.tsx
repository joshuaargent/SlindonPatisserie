import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
  size?: 'default' | 'large';
  variant?: 'dark' | 'light';
}

// ============================================
// Component
// ============================================

export function PageHeader({
  title,
  description,
  children,
  className,
  align = 'center',
  size = 'default',
  variant = 'dark',
}: PageHeaderProps) {
  const bgClass = variant === 'dark' ? 'bg-[#3A2C2A]' : 'bg-[#FFF8E7]';
  const titleClass = variant === 'dark' ? 'text-[#F7F2E9]' : 'text-[#3A2C2A]';
  const descClass = variant === 'dark' ? 'text-[#F7F2E9]/80' : 'text-[#6B5344]';

  return (
    <header className={cn('py-12 md:py-16', bgClass, size === 'large' && 'py-16 md:py-24', className)}>
      <div className={cn('container', align === 'center' && 'text-center')}>
        <h1
          className={cn(
            'font-bold tracking-tight font-serif',
            titleClass,
            size === 'default' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'mt-4 max-w-2xl text-lg',
              descClass,
              align === 'center' && 'mx-auto'
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
