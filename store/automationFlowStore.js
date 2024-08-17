import { create } from "zustand";

export const useAutomationFlowStore = create((set) => ({
  selectedNode: null,
  sourceNode: null,
  setSelectedNode: (node) => set((state) => (state.selectedNode = node)),
  setSourceNode: (node) => set((state) => (state.sourceNode = node)),
}));
