import { sitePath } from "./paths";

/**
 * Absolute URL for a site-root path (the deployment base is added when the
 * path does not already carry it). Falls back to the relative path when the
 * build has no `site`, which only happens for `SITE_URL`-less local builds.
 */
export const absoluteUrl = (site: URL | undefined, path: string) =>
  site ? new URL(sitePath(path), site).href : sitePath(path);

/** Absolute URL for a pathname that already includes the deployment base. */
export const currentUrl = (site: URL | undefined, pathname: string) =>
  site ? new URL(pathname, site).href : pathname;
