import type { ReactNode } from "react";

export default function CourseInfoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      {children}
    </div>
  );
}
