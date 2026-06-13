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
}: PageHeaderProps) {
  return (
    <header className={cn('py-12 md:py-16 bg-[#FFF8E7]', size === 'large' && 'py-16 md:py-24', className)}>
      <div className={cn('container', align === 'center' && 'text-center')}>
        <h1
          className={cn(
            'text-[#3A2C2A] font-bold tracking-tight font-serif',
            size === 'default' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'text-[#6B5344] mt-4 max-w-2xl text-lg',
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
