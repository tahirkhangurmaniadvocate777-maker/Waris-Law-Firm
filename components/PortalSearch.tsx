"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  groupSearchResults,
  searchPortalCatalog,
  type PortalSearchEntry,
} from "@/lib/portalSearchCatalog";

type PortalSearchProps = {
  onNavigate?: () => void;
  /** Sidebar uses dark; tools hub page uses light. */
  variant?: "dark" | "light";
  className?: string;
};

export function PortalSearch({
  onNavigate,
  variant = "dark",
  className = "",
}: PortalSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchPortalCatalog(query), [query]);
  const groups = useMemo(() => groupSearchResults(results), [results]);
  const flat = results;
  const light = variant === "light";

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function select(_item: PortalSearchEntry) {
    setQuery("");
    setOpen(false);
    onNavigate?.();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter") && query.trim()) {
      setOpen(true);
    }
    if (!flat.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = flat[activeIndex];
      if (item) {
        select(item);
        router.push(item.href);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && query.trim().length > 0;

  return (
    <div
      ref={rootRef}
      className={`relative ${light ? "" : "border-b border-slate-700/80 px-3 py-3"} ${className}`}
    >
      <label htmlFor={inputId} className="sr-only">
        Search law fields and drafting tools
      </label>
      <div className="relative">
        <span
          aria-hidden
          className={`pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 ${
            light ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </span>
        <input
          id={inputId}
          type="search"
          value={query}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="Search law fields, statutes, tools…"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={
            light
              ? "w-full rounded-lg border border-slate-300 bg-white py-3 pr-3 pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              : "w-full rounded-md border border-slate-700 bg-slate-950 py-2 pr-3 pl-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/40"
          }
        />
      </div>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className={
            light
              ? "absolute inset-x-0 z-40 mt-2 max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl"
              : "absolute inset-x-3 z-40 mt-2 max-h-72 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950 shadow-xl"
          }
        >
          {flat.length === 0 ? (
            <p className={`px-3 py-3 text-xs ${light ? "text-slate-500" : "text-slate-500"}`}>
              No matches. Try bail, khula, mutation, FBR, declaration…
            </p>
          ) : (
            groups.map((group) => (
              <div
                key={group.field}
                className={`border-b last:border-b-0 ${light ? "border-slate-100" : "border-slate-800"}`}
              >
                <p
                  className={`sticky top-0 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase ${
                    light
                      ? "bg-slate-50/95 text-slate-500"
                      : "bg-slate-950/95 text-slate-500"
                  }`}
                >
                  {group.field}
                </p>
                <ul>
                  {group.items.map((item) => {
                    const index = flat.indexOf(item);
                    const active = index === activeIndex;
                    return (
                      <li key={item.id} role="option" aria-selected={active}>
                        <Link
                          href={item.href}
                          onClick={() => select(item)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={`block px-3 py-2 text-sm transition ${
                            active
                              ? light
                                ? "bg-indigo-50 text-indigo-900"
                                : "bg-indigo-500/20 text-indigo-100"
                              : light
                                ? "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                : "text-slate-300 hover:bg-slate-900 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
