import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Heartbeat for signed-in common users; the server ignores team accounts. */
export function usePresenceHeartbeat() {
  useEffect(() => {
    let alive = true;
    const beat = async () => {
      if (!alive || document.visibilityState !== "visible") return;
      const { data } = await supabase.auth.getSession();
      if (data.session) await supabase.rpc("touch_presence");
    };
    void beat();
    const t = setInterval(() => void beat(), 30_000);
    const onVis = () => void beat();
    document.addEventListener("visibilitychange", onVis);
    return () => { alive = false; clearInterval(t); document.removeEventListener("visibilitychange", onVis); };
  }, []);
}
