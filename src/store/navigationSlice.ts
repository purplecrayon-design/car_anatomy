import type { StateCreator } from 'zustand';
import type { BreadcrumbEntry } from '@/types/ui';

export interface NavigationSlice {
  breadcrumbs: BreadcrumbEntry[];
  navigationHistory: string[];
  pushBreadcrumb: (entry: BreadcrumbEntry) => void;
  popBreadcrumb: () => void;
  clearBreadcrumbs: () => void;
  pushHistory: (pageId: string) => void;
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set) => ({
  breadcrumbs: [],
  navigationHistory: [],
  pushBreadcrumb: (entry) => set((s) => ({ breadcrumbs: [...s.breadcrumbs.slice(-7), entry] })),
  popBreadcrumb: () => set((s) => ({ breadcrumbs: s.breadcrumbs.slice(0, -1) })),
  clearBreadcrumbs: () => set({ breadcrumbs: [] }),
  pushHistory: (pageId) => set((s) => ({ navigationHistory: [...s.navigationHistory.slice(-49), pageId] })),
});
