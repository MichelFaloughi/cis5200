"use client";

import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Shell({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("sidebarCollapsed") === "true") {
        setCollapsed(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        window.localStorage.setItem("sidebarCollapsed", String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapsed();
        return;
      }
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen">
      {!collapsed && (
        <aside className="hidden w-64 shrink-0 border-r border-neutral-200 md:block dark:border-neutral-800">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </aside>
      )}

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside
            id="mobile-sidebar"
            className="fixed inset-y-0 left-0 z-50 w-72 border-r border-neutral-200 shadow-xl md:hidden dark:border-neutral-800"
          >
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          onToggleSidebar={toggleCollapsed}
          sidebarCollapsed={collapsed}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        {footer}
      </div>
    </div>
  );
}
