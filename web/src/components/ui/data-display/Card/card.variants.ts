import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  ['rounded-xl', 'transition-all duration-200 ease-out'],
  {
    variants: {
      variant: {
        default: 'bg-[var(--card-surface-bg)] border border-[var(--card-border-color)]',
        solid: 'bg-[var(--card-surface-bg)] border border-transparent',
        outline: 'bg-transparent border-2 border-[var(--card-border-color)]',
        ghost: 'bg-transparent border border-transparent',
        elevated: 'bg-[var(--card-surface-bg)] border border-[var(--card-border-color)] shadow-[var(--card-shadow)]',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:border-[var(--card-border-hover)] hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;
