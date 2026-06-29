import { withSupabase } from "@supabase/server";

/**
 * Example: Admin function using secret key
 * Auth: Uses SUPABASE_SECRET_KEY for full access
 * Usage: Called server-to-server, cron jobs, webhooks
 * 
 * In supabase/config.toml, set verify_jwt = false for this function
 */
export default {
  fetch: withSupabase({ auth: "secret" }, async (req, ctx) => {
    // ctx.supabaseAdmin has full RLS bypass with secret key auth
    
    const url = new URL(req.url);
    const method = req.method;

    // GET /functions/v1/admin/users - List all users (admin only)
    if (method === "GET" && url.pathname === "/functions/v1/admin/users") {
      const { data, error } = await ctx.supabaseAdmin.auth.admin.listUsers();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(data.users), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST /functions/v1/admin/sync - Sync data (admin only)
    if (method === "POST" && url.pathname === "/functions/v1/admin/sync") {
      const { data, error } = await ctx.supabaseAdmin
        .from("campaign_donations")
        .select("count(*)", { count: "exact" });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ 
          message: "Sync completed",
          totalDonations: data?.[0]?.count || 0
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }),
};
