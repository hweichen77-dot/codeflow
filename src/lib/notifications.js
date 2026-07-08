
const isDesktop = () => typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;

export async function getPermissionState() {
  try {
    if (isDesktop()) {
      const { isPermissionGranted } = await import("@tauri-apps/plugin-notification");
      return (await isPermissionGranted()) ? "granted" : "default";
    }
    if (typeof Notification === "undefined") return "unsupported";
    return Notification.permission;
  } catch {
    return "unsupported";
  }
}

export async function requestNotificationPermission() {
  try {
    if (isDesktop()) {
      const { isPermissionGranted, requestPermission } = await import("@tauri-apps/plugin-notification");
      let granted = await isPermissionGranted();
      if (!granted) granted = (await requestPermission()) === "granted";
      return granted;
    }
    if (typeof Notification === "undefined") return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

export async function notify(title, body) {
  try {
    if (isDesktop()) {
      const { isPermissionGranted, sendNotification } = await import("@tauri-apps/plugin-notification");
      if (await isPermissionGranted()) sendNotification({ title, body });
      return;
    }
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {

      new Notification(title, { body, icon: "/favicon.svg" });
    }
  } catch {

  }
}
