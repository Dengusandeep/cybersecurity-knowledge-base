"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // When the implicit flow resolves from the URL hash (#access_token=...)
      // Supabase establishes the session and fires the PASSWORD_RECOVERY event
      if (event === "PASSWORD_RECOVERY") {
        router.push("/update-password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
