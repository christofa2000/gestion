"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Club {
  id: string;
  name: string;
  logo?: string;
}

interface ClubState {
  currentClub: Club | null;
  setCurrentClub: (club: Club) => void;
  clearClub: () => void;
}

export const useClubStore = create<ClubState>()(
  persist(
    (set) => ({
      currentClub: null,
      setCurrentClub: (club) => set({ currentClub: club }),
      clearClub: () => set({ currentClub: null }),
    }),
    {
      name: "current-club-storage",
    }
  )
);

