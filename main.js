import { Client, Databases } from "node-appwrite";

export default async ({ event, payload, log, req }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  // Extract user info
  const user = JSON.parse(payload);
  const userId = user.$id;

  try {
    // Create new profile in `profiles` collection
    await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.COLLECTION_ID_PROFILES,
      userId, // use same ID as auth
      {
        first_name: "",
        last_name: "",
        email: user.email,
        phone: user.phone ?? "",
        avatar_url: "",
        date_of_birth: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
    log("✅ Profile created for user: " + userId);
  } catch (err) {
    log("❌ Error creating profile: " + err.message);
  }
};
