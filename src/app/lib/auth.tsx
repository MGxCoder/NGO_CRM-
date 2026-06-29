import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// Creates the tenants row if it doesn't exist yet.
// Safe to call on every login/session restore — uses upsert with ignoreDuplicates.
async function ensureTenantRow(user: User) {
  if (!supabase) return;
  const tenantId = (user.user_metadata?.tenant_id as string | undefined) || user.id;
  const orgName = (user.user_metadata?.org_name as string | undefined) || "My Organization";
  await supabase
    .from("tenants")
    .upsert({ id: tenantId, name: orgName }, { onConflict: "id", ignoreDuplicates: true });
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, string>) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  resendConfirmation: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await ensureTenantRow(session.user);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Fire-and-forget on subsequent auth events — tenant row already exists after getSession
      if (session?.user) void ensureTenantRow(session.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, string>,
  ): Promise<{ error: string | null; needsConfirmation?: boolean }> => {
    if (!supabase) return { error: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local." };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) return { error: error.message };
    // When email confirmation is required, signUp succeeds but returns no session
    const needsConfirmation = !!data.user && !data.session;
    return { error: null, needsConfirmation };
  };

  const resendConfirmation = async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: "Supabase is not configured." };
    const { error } = await supabase.auth.resend({ type: "signup", email });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, resendConfirmation, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
