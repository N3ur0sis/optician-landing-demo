import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
        // Mobile: fixed height cards, Desktop: flexible rows that fill space
        "auto-rows-[8rem] md:auto-rows-[10rem] lg:auto-rows-[1fr]",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      "bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all",
      "transform-gpu min-h-[10rem]",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-4 lg:p-5 transition-all duration-300 group-hover:-translate-y-8">
      <Icon className="h-8 w-8 lg:h-10 lg:w-10 origin-left transform-gpu text-gray-900 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-base lg:text-lg font-semibold text-gray-900">
        {name}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-3 lg:p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto text-black hover:text-black text-sm">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-gray-50/50" />
  </div>
);

export { BentoCard, BentoGrid };
