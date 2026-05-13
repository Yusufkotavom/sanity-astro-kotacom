import { createClient } from "@sanity/client";

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET ?? "production";
const apiVersion = import.meta.env.SANITY_API_VERSION ?? "2026-05-13";
const useCdn = String(import.meta.env.SANITY_USE_CDN ?? "true") === "true";
const token = import.meta.env.SANITY_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID is required");

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token,
  perspective: "published",
});
