import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Talent, TalentCard } from './types';

export interface ScheduleItem {
    phase: 'Development' | 'Pre-Production' | 'Production' | 'Post-Production';
    durationWeeks: number;
    enabled: boolean;
}

export interface DraftProject {
    name: string;
    currency: 'USD' | 'EUR' | 'GBP' | 'NGN';
    brief: string;
    type: string;
    subType: string;
    genre: string;
    budget: number;
    ambition: number; // 0-10
    startDate: string | null; // ISO string
    schedule: ScheduleItem[];
    selectedTalents: (Talent | TalentCard)[];
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
    { phase: 'Development', durationWeeks: 4, enabled: true },
    { phase: 'Pre-Production', durationWeeks: 8, enabled: true },
    { phase: 'Production', durationWeeks: 4, enabled: true },
    { phase: 'Post-Production', durationWeeks: 12, enabled: true },
];

const DEFAULT_DRAFT: DraftProject = {
    name: '',
    currency: 'USD',
    brief: '',
    type: '',
    subType: '',
    genre: '',
    budget: 50000,
    ambition: 5,
    startDate: null,
    schedule: DEFAULT_SCHEDULE,
    selectedTalents: [],
};

interface AppState {
    // UI State
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Quick View State
    quickViewTalent: Talent | TalentCard | null;
    openQuickView: (talent: Talent | TalentCard) => void;
    closeQuickView: () => void;

    // Project Draft State
    draft: DraftProject;
    addToProject: (talent: Talent | TalentCard) => void;
    removeFromProject: (talentId: string) => void;
    updateDraft: (updates: Partial<DraftProject>) => void;
    updateScheduleItem: (index: number, updates: Partial<ScheduleItem>) => void;
    clearDraft: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // UI State
            isSidebarCollapsed: false,
            toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

            // Quick View State
            quickViewTalent: null,
            openQuickView: (talent) => set({ quickViewTalent: talent }),
            closeQuickView: () => set({ quickViewTalent: null }),

            // Project Draft State
            draft: DEFAULT_DRAFT,
            addToProject: (talent) => set((state) => {
                // Prevent duplicates
                if (state.draft.selectedTalents.some(t => t.talent_id === talent.talent_id)) {
                    return state;
                }
                return {
                    draft: {
                        ...state.draft,
                        selectedTalents: [...state.draft.selectedTalents, talent]
                    }
                };
            }),
            removeFromProject: (talentId) => set((state) => ({
                draft: {
                    ...state.draft,
                    selectedTalents: state.draft.selectedTalents.filter(t => t.talent_id !== talentId)
                }
            })),
            updateDraft: (updates) => set((state) => ({
                draft: { ...state.draft, ...updates }
            })),
            updateScheduleItem: (index, updates) => set((state) => {
                const newSchedule = [...state.draft.schedule];
                newSchedule[index] = { ...newSchedule[index], ...updates };
                return {
                    draft: { ...state.draft, schedule: newSchedule }
                };
            }),
            clearDraft: () => set({ draft: DEFAULT_DRAFT }),
        }),
        {
            name: 'icuni-app-storage',
            partialize: (state) => ({
                isSidebarCollapsed: state.isSidebarCollapsed,
                draft: state.draft
            }), // Don't persist quickViewTalent
        }
    )
);
