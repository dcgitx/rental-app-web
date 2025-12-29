import { ref } from "vue";

const activePanel = ref(null);

export function usePanelStore() {
    function togglePanel(panel) {
        activePanel.value = activePanel.value === panel ? null : panel;
    }
    function closePanel() {
        activePanel.value = null;
    }

    return { activePanel, togglePanel, closePanel };
}
