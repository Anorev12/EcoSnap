import { useState, useCallback, useRef } from "react";

let idCounter = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef({});

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

  const success = (msg, opts) => notify({ message: msg, type: "success", ...opts });
  const error = (msg, opts) => notify({ message: msg, type: "error", ...opts });
  const warning = (msg, opts) => notify({ message: msg, type: "warning", ...opts });
  const info = (msg, opts) => notify({ message: msg, type: "info", ...opts });

  return { notifications, notify, success, error, warning, info, dismiss };
}