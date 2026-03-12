"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ChainResourceLink } from "@/components/chain-resources/chain-resource-link";
import { getPrimaryQuickActionResources } from "@/features/chain-resources/data";

type ChainResourcesQuickActionProps = {
  networkId: string;
};

export function ChainResourcesQuickAction({ networkId }: ChainResourcesQuickActionProps) {
  const resources = getPrimaryQuickActionResources(networkId);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const MENU_WIDTH_PX = 288;
  const VIEWPORT_PADDING_PX = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const menuHeight = menuRef.current?.offsetHeight ?? 220;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const canOpenBelow =
        rect.bottom + 8 + menuHeight <= viewportHeight - VIEWPORT_PADDING_PX;
      const top = canOpenBelow
        ? rect.bottom + 8
        : Math.max(VIEWPORT_PADDING_PX, rect.top - menuHeight - 8);

      const left = Math.min(
        Math.max(VIEWPORT_PADDING_PX, rect.left),
        viewportWidth - MENU_WIDTH_PX - VIEWPORT_PADDING_PX
      );

      setPosition({
        top,
        left
      });
    }

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);
      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
      }
    }

    updatePosition();
    requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  if (resources.length === 0) {
    return <span className="text-xs text-ink-300">Resources N/A</span>;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        data-no-row-nav="true"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        className="inline-flex cursor-pointer rounded-md border border-ink-300/30 bg-ink-900/25 px-2 py-1 text-xs font-medium text-ink-100 hover:bg-ink-900/40"
      >
        Resources
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              data-no-row-nav="true"
              className="fixed z-[100] w-72 rounded-xl border border-ink-300/20 bg-slateglass-700/95 p-3 shadow-glow backdrop-blur"
              style={{ top: `${position.top}px`, left: `${position.left}px` }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-ink-300">Available Links</p>
              <div className="flex flex-wrap gap-2">
                {resources.map((resource) => (
                  <span key={`${resource.category}-${resource.label}-${resource.url}`} data-no-row-nav="true">
                    <ChainResourceLink resource={resource} compact />
                  </span>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
