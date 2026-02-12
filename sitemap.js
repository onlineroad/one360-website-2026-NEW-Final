/**
 * Optional helper config if integrating `next-sitemap` in CI.
 * App Router already generates sitemap via `src/app/sitemap.ts`.
 */
module.exports = {
  siteUrl: "https://one360.com.au",
  generateRobotsTxt: false,
  outDir: "out"
};
