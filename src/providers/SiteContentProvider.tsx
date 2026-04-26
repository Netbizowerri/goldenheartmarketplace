import * as React from "react";
import type { SiteContent } from "@/shared/site-content";

interface SiteContentContextValue {
  content: SiteContent | null;
  isLoading: boolean;
  error: string;
  retry: () => Promise<void>;
}

const SiteContentContext = React.createContext<SiteContentContextValue | undefined>(undefined);

async function readSiteContent(): Promise<SiteContent> {
  const response = await fetch("/api/site-content");
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || "We could not load the page content.");
  }

  if (!payload) {
    throw new Error("The page content response was empty.");
  }

  return payload as SiteContent;
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const nextContent = await readSiteContent();
      setContent(nextContent);
    } catch (loadError) {
      setContent(null);
      setError(loadError instanceof Error ? loadError.message : "We could not load the page content.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const value = React.useMemo(
    () => ({ content, isLoading, error, retry: load }),
    [content, error, isLoading, load],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const value = React.useContext(SiteContentContext);

  if (!value) {
    throw new Error("useSiteContent must be used within SiteContentProvider.");
  }

  return value;
}
