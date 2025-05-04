import { BASE_URL } from "@/lib/variables";

export const ROOTKEYWORDS = [
  "invoice",
  "invoice generator",
  "invoice generating",
  "invoice app",
  "invoice generator app",
  "free invoice generator",
];

// TODO: update image
export const JSONLD = {
  "@context": "https://schema.org",
  "@type": "Website",
  name: "Invoizer",
  description: "An Invoice Generator Web App",
  keywords: ROOTKEYWORDS,
  url: BASE_URL,
  image:
    "https://invoify.vercel.app/_next/static/media/invoify-logo.7ef8fa33.svg",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/#website`,
  },
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: `${BASE_URL}`,
    },
  ],
};
