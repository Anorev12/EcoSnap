import { useState, useCallback, useRef, useEffect } from "react";

const API = "http://localhost:8080";
const POLL_MS = 15_000;
let idCounter = 0;

export function useNotifications(user) {
  const [notifications, setNotifications] = useState([]);
  const timers     = useRef({});
  const seenIds    = useRef(new Set()); // backend notification IDs shown this session
  const pollTimer  = useRef(null);

  // ── Dismiss (unchanged) ───────────────────────────────────────
  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, exiting: true } : n))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 350);
  }, []);

  // ── Core notify (unchanged) ───────────────────────────────────
  const notify = useCallback(
    ({ message, type = "info", duration = 4000, title }) => {
      const id = ++idCounter;
      setNotifications((prev) => [
        { id, message, type, title, exiting: false },
        ...prev,
      ]);
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  // ── Shorthand helpers (unchanged) ─────────────────────────────
  const success = (msg, opts) => notify({ message: msg, type: "success", ...opts });
  const error   = (msg, opts) => notify({ message: msg, type: "error",   ...opts });
  const warning = (msg, opts) => notify({ message: msg, type: "warning", ...opts });
  const info    = (msg, opts) => notify({ message: msg, type: "info",    ...opts });

  // ── Backend polling — user-scoped ─────────────────────────────
  const pollBackend = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/api/notifications/${user.id}/unread`);
      if (!res.ok) return;
      const unread = await res.json();

      unread.forEach((n) => {
        if (seenIds.current.has(n.id)) return;
        seenIds.current.add(n.id);

        // Surface as a toast using the existing notify API
        notify({
          type: "info",
          title: n.title ?? (n.icon ? `${n.icon} Notification` : "Notification"),
          message: n.message,
        });

        // Mark read on the backend so it won't reappear next poll
        fetch(`${API}/api/notifications/${user.id}/${n.id}/read`, {
          method: "PUT",
        }).catch(() => {});
      });
    } catch {
      // Silently ignore network errors during polling
    }
  }, [user?.id, notify]);

  useEffect(() => {
    if (!user?.id) return;
    pollBackend(); // immediate first check
    pollTimer.current = setInterval(pollBackend, POLL_MS);
    return () => clearInterval(pollTimer.current);
  }, [user?.id, pollBackend]);

  return { notifications, notify, success, error, warning, info, dismiss };
}