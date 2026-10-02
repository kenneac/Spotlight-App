import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-convex-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return new Response(
        "Missing CLERK_WEBHOOK_SECRET environment variable",
        {
          status: 500,
        }
      );
    }

    // Get the Svix headers
    const svixId = request.headers.get("svix-id");
    const svixSignature = request.headers.get("svix-signature");
    const svixTimestamp = request.headers.get("svix-timestamp");

    if (!svixId || !svixSignature || !svixTimestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }
   
    const body = await request.text();
    const wh = new Webhook(webhookSecret);

    try {
      wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (error) {
      console.error("Error verifying webhook:", error);

      return new Response("Error occurred while verifying webhook", {
        status: 400,
      });
    }

    // Parse the now-verified raw body into the Clerk event payload.
    let evt: unknown;

    try {
      evt = JSON.parse(body);
    } catch (error) {
      console.error("Invalid webhook payload:", error);

      return new Response("Invalid webhook payload", {
        status: 400,
      });
    }

    if (!evt || typeof evt !== "object") {
      console.error("Invalid webhook payload:", evt);

      return new Response("Invalid webhook payload", {
        status: 400,
      });
    }

    const event = evt as {
      type?: string;
      data?: {
        id?: string;
        email_addresses?: { email_address?: string }[];
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string;
      };
    };

    const eventType = event.type;

    console.log("Clerk webhook event:", eventType);

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data ?? {};

      const email = email_addresses?.[0]?.email_address;

      if (!id || !email) {
        return new Response("Invalid user.created payload", {
          status: 400,
        });
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(internal.users.createUser, {
          email,
          fullname: name,
          image: image_url ?? "",
          clerkId: id,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.error("Error creating user:", error);

        return new Response("Error creating user", {
          status: 500,
        });
      }
    }

    return new Response("Webhook processed successfully", {
      status: 200,
    });
  }),
});

export default http;