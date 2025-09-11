import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "./utils";

// ---------------------
// Breadcrumb Container
// ---------------------
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

// ---------------------
// Breadcrumb List
// ---------------------
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

// ---------------------
// Breadcrumb Item
// ---------------------
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

// ---------------------
// Polymorphic Breadcrumb Link
// ---------------------
type BreadcrumbLinkProps<T extends React.ElementType = "a"> = {
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<T>;

// forwardRef polymorphique
const BreadcrumbLink = React.forwardRef<
  HTMLElement, // ref peut être sur Slot ou sur <a>
  BreadcrumbLinkProps
>(({ asChild, className, ...props }, ref) => {
  const Comp: React.ElementType = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref as React.Ref<any>} // TS accepte maintenant ref sur Slot ou <a>
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

// ---------------------
// Breadcrumb Page
// ---------------------
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
}

// ---------------------
// Breadcrumb Separator
// ---------------------
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

// ---------------------
// Breadcrumb Ellipsis
// ---------------------
function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

// ---------------------
// Exports
// ---------------------
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};