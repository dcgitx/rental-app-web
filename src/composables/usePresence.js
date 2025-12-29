import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

export function usePresence(intervalMinutes = 5, idleAfterMinutes = 10) {
    const lastActive = ref(Date.now());
    const isIdle = ref(false);
    const isTabVisible = ref(true);

    let idleTimeout = null;
    let pingInterval = null;

    const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll"];

    // if the device is touchscreen then add ontouchstart event
    if (typeof window !== "undefined" && "ontouchstart" in window) {
        ACTIVITY_EVENTS.push("touchstart");
    }

    const updateActivity = () => {
        lastActive.value = Date.now();
        isIdle.value = false;
        resetIdleTimer();
    };

    const resetIdleTimer = () => {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(
            () => {
                isIdle.value = true;
            },
            idleAfterMinutes * 60 * 1000,
        );
    };

    const sendHeartbeat = async () => {
        if (isIdle.value || !isTabVisible.value) return;
        try {
            await axios.post("/user/heartbeat");
        } catch {
            // silent fail
        }
    };

    const startHeartbeat = () => {
        if (pingInterval) clearInterval(pingInterval);
        pingInterval = setInterval(sendHeartbeat, intervalMinutes * 60 * 1000);
    };

    const stopHeartbeat = () => {
        if (pingInterval) clearInterval(pingInterval);
        pingInterval = null;
    };
    const handleVisibilityChange = () => {
        isTabVisible.value = !document.hidden;

        if (isTabVisible.value) {
            // Fully reset timers when tab becomes visible again
            clearTimeout(idleTimeout);
            clearInterval(pingInterval);

            isIdle.value = false;
            lastActive.value = Date.now();

            resetIdleTimer();
            startHeartbeat();

            // send initial heatbeat when the tab is focused again
            sendHeartbeat();
        } else {
            // tab hidden → pause heartbeat
            stopHeartbeat();
        }
    };

    onMounted(() => {
        if (typeof window === "undefined") return;

        // Listen for activity
        ACTIVITY_EVENTS.forEach((evt) => {
            try {
                window.addEventListener(evt, updateActivity, { passive: true });
            } catch (e) {
                console.warn("Failed to add listener:", evt, e);
            }
        });

        // Listen for tab visibility changes
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Start everything
        resetIdleTimer();
        startHeartbeat();
    });

    onUnmounted(() => {
        if (typeof window === "undefined") return;

        stopHeartbeat();
        clearTimeout(idleTimeout);

        ACTIVITY_EVENTS.forEach((evt) => {
            try {
                window.removeEventListener(evt, updateActivity);
            } catch (e) {
                console.warn("Failed to remove listener:", evt, e);
            }
        });

        document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
        );
    });

    return { lastActive, isIdle, isTabVisible };
}
