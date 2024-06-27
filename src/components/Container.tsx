import { cn } from "@/lib/utils";

function Container({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto container", className)} {...rest}>
      {children}
    </div>
  );
}

export default Container;
