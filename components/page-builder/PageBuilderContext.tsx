"use client";

import { createContext, useContext, ReactNode } from "react";

interface PageBuilderContextValue {
  isEditing: boolean;
}

const PageBuilderContext = createContext<PageBuilderContextValue>({
  isEditing: false,
});

export function PageBuilderProvider({
  children,
  isEditing = false,
}: {
  children: ReactNode;
  isEditing?: boolean;
}) {
  return (
    <PageBuilderContext.Provider value={{ isEditing }}>
      {children}
    </PageBuilderContext.Provider>
  );
}

export function usePageBuilder() {
  return useContext(PageBuilderContext);
}
