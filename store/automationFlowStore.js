import { create } from "zustand";

export const useAutomationFlowStore = create((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set((state) => (state.selectedNode = node)),
}));
