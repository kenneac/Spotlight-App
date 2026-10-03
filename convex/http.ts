import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-convex-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // ---------------------------------------------------------------
    // STEP 1: Check that the secret key is set
    // ---------------------------------------------------------------
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response(
        "Missing CLERK_WEBHOOK_SECRET environment variable",
        {
          status: 500,
        }
      );
    }

    // ---------------------------------------------------------------
    // STEP 2: Get the security headers sent with the request
    // ---------------------------------------------------------------
    // Get the Svix headers
    const svixId = request.headers.get("svix-id");
    const svixSignature = request.headers.get("svix-signature");
    const svixTimestamp = request.headers.get("svix-timestamp");

    // Stop if any header is missing
    if (!svixId || !svixSignature || !svixTimestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    // ---------------------------------------------------------------
    // STEP 3: Verify the request really came from Clerk
    // ---------------------------------------------------------------
    // Read the raw body text
    const body = await request.text();
    const wh = new Webhook(webhookSecret);

    try {
      // Check the signature using the secret
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

    // ---------------------------------------------------------------
    // STEP 4: Turn the verified body into data we can use
    // ---------------------------------------------------------------
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

    // Make sure the result is an object
    if (!evt || typeof evt !== "object") {
      console.error("Invalid webhook payload:", evt);

      return new Response("Invalid webhook payload", {
        status: 400,
      });
    }

    // Describe the shape of the data we expect from Clerk
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

    // ---------------------------------------------------------------
    // STEP 5: Find out what kind of event this is
    // ---------------------------------------------------------------
    const eventType = event.type;
    console.log("Clerk webhook event:", eventType);

    // ---------------------------------------------------------------
    // STEP 6: Handle the "user.created" event
    // ---------------------------------------------------------------
    if (eventType === "user.created") {
      // Pull out the user details
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data ?? {};

      const email = email_addresses?.[0]?.email_address;

      // Stop if the user ID or email is missing
      if (!id || !email) {
        return new Response("Invalid user.created payload", {
          status: 400,
        });
      }

      // Join first and last name into one full name
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      // Save the new user in the database
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

    // ---------------------------------------------------------------
    // STEP 7: Tell Clerk everything worked
    // ---------------------------------------------------------------
    return new Response("Webhook processed successfully", {
      status: 200,
    });
  }),
});

export default http;