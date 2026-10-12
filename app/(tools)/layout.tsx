import type { ReactNode } from "react";

type ToolsLayoutProps = {
  children: ReactNode;
};

export default function ToolsLayout({ children }: ToolsLayoutProps) {
  return (
    <section className="tools-layout">
      <p className="tools-banner">These tools run in your browser, so they need JavaScript.</p>
      {children}
    </section>
  );
}
