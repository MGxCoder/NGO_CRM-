import { withSupabase } from "@supabase/server";

/**
 * Example: Public function with no auth
 * Auth: None - accessible to anyone
 * Usage: Public APIs, webhooks, third-party integrations
 */
export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    // No authentication required
    // Use ctx.supabaseAdmin for read-only public data
    
    const url = new URL(req.url);
    const method = req.method;

    // GET /functions/v1/public/campaigns - List public campaigns
    if (method === "GET" && url.pathname === "/functions/v1/public/campaigns") {
      const { data, error } = await ctx.supabaseAdmin
        .from("campaigns")
        .select("id, name, description, status, goal_amount, amount_raised")
        .eq("status", "Live");

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(data), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
      });
    }

    // POST /functions/v1/public/subscribe - Subscribe to newsletter
    if (method === "POST" && url.pathname === "/functions/v1/public/subscribe") {
      const body = await req.json() as { email: string };

      // Simple validation
      if (!body.email || !body.email.includes("@")) {
        return new Response(
          JSON.stringify({ error: "Invalid email" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Could insert into a subscribers table
      return new Response(
        JSON.stringify({ message: "Subscription received" }),
        { 
          status: 200,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }),
};
