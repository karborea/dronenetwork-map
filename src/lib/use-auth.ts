"use client";

import { useEffect, useState } from "react";
import { WP_SITE_URL as WP_BASE } from "./site";

/**
 * Cross-subdomain login probe. The WordPress backend (dronenetwork.ca)
 * shares its auth cookie across *.dronenetwork.ca (COOKIE_DOMAIN), so this map
 * app (app.dronenetwork.ca) can read the session via a credentialed fetch to
 * GET /wp-json/dn/v1/me. Falls back to logged-out with sensible WP URLs if the
 * probe fails.
 */
export interface AuthState {
  loading: boolean;
  loggedIn: boolean;
  displayName?: string;
  loginUrl: string;
  registerUrl: string;
  dashboardUrl: string;
}

const FALLBACK: Omit<AuthState, "loading" | "loggedIn" | "displayName"> = {
  loginUrl: `${WP_BASE}/login/`,
  registerUrl: `${WP_BASE}/register/`,
  dashboardUrl: `${WP_BASE}/customer-dashboard/`,
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    loggedIn: false,
    ...FALLBACK,
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`${WP_BASE}/wp-json/dn/v1/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        setState({
          loading: false,
          loggedIn: !!d.logged_in,
          displayName: d.display_name,
          loginUrl: d.login_url ?? FALLBACK.loginUrl,
          registerUrl: d.register_url ?? FALLBACK.registerUrl,
          dashboardUrl: d.dashboard_url ?? FALLBACK.dashboardUrl,
        });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
