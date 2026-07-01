import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-sky-300 text-slate-950 hover:bg-sky-200",
        secondary: "border border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-300 hover:text-sky-200",
        destructive: "border border-red-400/40 bg-slate-900 text-red-300 hover:border-red-300 hover:bg-red-950/30",
        ghost: "text-slate-300 hover:bg-slate-800 hover:text-sky-200",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-3",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, ...props }, ref) => (
    <button className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
  ),
);

Button.displayName = "Button";

export { buttonVariants };
