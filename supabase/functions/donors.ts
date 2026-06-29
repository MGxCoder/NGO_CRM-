import { withSupabase } from "@supabase/server";

/**
 * Example: User-authenticated function
 * Auth: User must provide valid JWT token
 * Usage: Called from authenticated client
 */
export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    // ctx.supabase is RLS-scoped to the authenticated user
    // ctx.supabaseAdmin bypasses RLS (use with caution)
    
    const url = new URL(req.url);
    const method = req.method;

    // GET /functions/v1/donors - List user's donors
    if (method === "GET" && url.pathname === "/functions/v1/donors") {
      const { data, error } = await ctx.supabase
        .from("donors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST /functions/v1/donors - Create a donor
    if (method === "POST" && url.pathname === "/functions/v1/donors") {
      const body = await req.json() as { name: string; email: string };

      const { data, error } = await ctx.supabase
        .from("donors")
        .insert([{ name: body.name, email: body.email }])
        .select();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }),
};
