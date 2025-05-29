// کامپوننت برای لود کردن استایل‌های اختصاصی منوی کشویی
import React from 'react';

export function StyleFix() {
  return (
    <style jsx global>{`
      [data-radix-popper-content-wrapper] > div,
      [data-radix-popper-content-wrapper] [role="menu"],
      [data-radix-popper-content-wrapper] [role="listbox"],
      [data-radix-select-content],
      [data-state="open"] > [data-radix-select-viewport],
      [data-radix-menu-content] {
        background-color: #0e101a !important;
        opacity: 1 !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
      }

      .dark [data-radix-popper-content-wrapper] > div,
      .dark [data-radix-popper-content-wrapper] [role="menu"],
      .dark [data-radix-popper-content-wrapper] [role="listbox"] {
        background-color: #0e101a !important;
      }

      [data-radix-popper-content-wrapper] [role="menu"] *,
      [data-radix-popper-content-wrapper] [role="listbox"] * {
        color: #fff !important;
      }

      /* اصلاح منوهای کشویی در حالت روشن */
      :root:not(.dark) [data-radix-popper-content-wrapper] > div,
      :root:not(.dark) [data-radix-popper-content-wrapper] [role="menu"],
      :root:not(.dark) [data-radix-popper-content-wrapper] [role="listbox"] {
        background-color: #ffffff !important;
      }

      :root:not(.dark) [data-radix-popper-content-wrapper] [role="menu"] *,
      :root:not(.dark) [data-radix-popper-content-wrapper] [role="listbox"] * {
        color: #0e101a !important;
      }        /* Fix for React.Children.only error in Radix UI */
      [data-radix-dropdown-menu-trigger],
      [data-radix-tooltip-trigger],
      [data-radix-alert-dialog-trigger],
      [data-radix-select-trigger],
      [data-radix-dialog-trigger],
      [data-radix-hover-card-trigger],
      [data-radix-menubar-trigger],
      [data-radix-navigation-menu-trigger],
      [data-radix-tabs-trigger],
      [data-radix-collapsible-trigger],
      [data-radix-popover-trigger],
      [data-radix-context-menu-trigger],
      [data-radix-accordion-trigger],
      [data-radix-checkbox],
      [data-radix-radio-group-item],
      [data-radix-toggle],
      [data-radix-scroll-area] {
        display: inline-flex;
      }
      
      /* Ensure elements inside asChild components don't cause React.Children.only errors */
      [data-radix-dropdown-menu-trigger] > button,
      [data-radix-tooltip-trigger] > button,
      [data-radix-alert-dialog-trigger] > button,
      [data-radix-select-trigger] > button,
      [data-radix-dialog-trigger] > button,
      [data-radix-hover-card-trigger] > button,
      [data-radix-menubar-trigger] > button,
      [data-radix-navigation-menu-trigger] > button,
      [data-radix-tabs-trigger] > button,
      [data-radix-collapsible-trigger] > button,
      [data-radix-popover-trigger] > button,
      [data-radix-context-menu-trigger] > button,
      [data-radix-accordion-trigger] > button,
      
      [data-radix-dropdown-menu-trigger] > a,
      [data-radix-tooltip-trigger] > a,
      [data-radix-alert-dialog-trigger] > a,
      [data-radix-select-trigger] > a,
      [data-radix-dialog-trigger] > a,
      [data-radix-hover-card-trigger] > a,
      [data-radix-menubar-trigger] > a,
      [data-radix-navigation-menu-trigger] > a,
      [data-radix-tabs-trigger] > a,
      [data-radix-collapsible-trigger] > a,
      [data-radix-popover-trigger] > a,
      [data-radix-context-menu-trigger] > a,
      [data-radix-accordion-trigger] > a {
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      [data-radix-menubar-trigger] > button,
      [data-radix-navigation-menu-trigger] > button,
      [data-radix-dropdown-menu-trigger] > a,
      [data-radix-tooltip-trigger] > a,
      [data-radix-alert-dialog-trigger] > a,
      [data-radix-select-trigger] > a,
      [data-radix-dialog-trigger] > a,
      [data-radix-hover-card-trigger] > a,
      [data-radix-menubar-trigger] > a,
      [data-radix-navigation-menu-trigger] > a {
        width: 100%;
        height: 100%;
      }
      
      /* Fix for badge-container in conditional rendering */
      .badge-container:empty::before {
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        overflow: hidden;
      }
      
      /* Fix for status indicators */
      .status-indicator {
        display: block;
      }
    `}</style>
  );
}
