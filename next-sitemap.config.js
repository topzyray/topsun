/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://sms.vercel.app",
  generateRobotsTxt: true,
  trailingSlash: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "*",
      },
    ],
  },
};
