"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";

/**
 * Demo-only admin gate. There is no backend, so this is NOT real security.
 * It only hides the admin screens from casual visitors.
 */
const KEY = "zarina-admin-session-v1";
const EVENT = "zarina-admin-auth";

export function adminLogin(password: string): boolean {
  if (password !== siteConfig.admin.password) return false;
  try {
    sessionStorage.setItem(KEY, "1");
    window.dispatchEvent(new Event(EVENT));
  } catch {
    return false;
  }
  return true;
}

export function adminLogout(): void {
  try {
    sessionStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Ignore blocked storage.
  }
}

function subscribe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

type Session = "loading" | "in" | "out";

function snapshot(): Session {
  try {
    return sessionStorage.getItem(KEY) === "1" ? "in" : "out";
  } catch {
    return "out";
  }
}

/** "loading" on the server and first render, then "in" or "out". */
export function useAdminSession(): Session {
  return useSyncExternalStore(subscribe, snapshot, (): Session => "loading");
}
