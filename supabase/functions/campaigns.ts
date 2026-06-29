import { withSupabase } from "@supabase/server";

/**
 * Campaigns API - User-authenticated function
 * GET /functions/v1/campaigns - List campaigns
 * GET /functions/v1/campaigns?id=UUID - Get single campaign with stats
 * Auth: User must be authenticated
 */
export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const url = new URL(req.url);
    const method = req.method;
    const campaignId = url.searchParams.get("id");

    // GET /functions/v1/campaigns - List all campaigns for user
    if (method === "GET" && !campaignId) {
      const { data, error } = await ctx.supabase
        .from("campaigns")
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

    // GET /functions/v1/campaigns?id=UUID - Get campaign with stats
    if (method === "GET" && campaignId) {
      const { data: campaign, error: campaignError } = await ctx.supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (campaignError) {
        return new Response(
          JSON.stringify({ error: campaignError.message }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Get related stats
      const [registrations, donations, volunteers] = await Promise.all([
        ctx.supabase
          .from("campaign_registrations")
          .select("*")
          .eq("campaign_id", campaignId),
        ctx.supabase
          .from("campaign_donations")
          .select("*")
          .eq("campaign_id", campaignId),
        ctx.supabase
          .from("campaign_volunteers")
          .select("*")
          .eq("campaign_id", campaignId),
      ]);

      return new Response(
        JSON.stringify({
          campaign,
          stats: {
            registrations: registrations.data?.length || 0,
            donations: donations.data?.length || 0,
            totalRaised: donations.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0,
            volunteers: volunteers.data?.length || 0,
          },
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // POST /functions/v1/campaigns - Create campaign
    if (method === "POST") {
      try {
        const body = await req.json() as {
          name: string;
          type: string;
          goal_amount: number;
          description?: string;
        };

        const { data, error } = await ctx.supabase
          .from("campaigns")
          .insert([{
            name: body.name,
            type: body.type,
            goal_amount: body.goal_amount,
            description: body.description || null,
            status: "Draft",
          }])
          .select();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify(data?.[0]), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Invalid request body" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }),
};

