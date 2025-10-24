export const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : "";
