export const BRAND_CONFIG = {
  name: "RailVoya",
  domain: "railvoya.co.in",
  tagline: "Every journey, made simpler.",
  heroHeadline: "Your next journey starts here.",
  supportEmail: "support@railvoya.co.in",
  supportPhone: "1800-111-VOYA",

  // Design Tokens
  colors: {
    primaryNavy: "#102A43",
    pageBackground: "#F6F8FC",
    cardBackground: "#FFFFFF",
    actionOrange: "#C2410C",
    actionOrangeHover: "#9A3412",
    decorativeOrange: "#F97316",
    textMain: "#132238",
    textSecondary: "#526277",
    borders: "#DCE3ED",
    statusSuccess: "#16734B",
    statusWarning: "#8A5100",
    statusError: "#B42318",
  },

  // Independent Service Disclosure
  disclaimer:
    "RailVoya is an independent train travel search and discovery website. We are not affiliated with, sponsored by, or an official agent of IRCTC or Indian Railways. All train schedules, fares, and availability shown are for simulation and demonstration purposes.",

  demoNotice:
    "Demo Mode Active — No real tickets are issued and no payment cards are billed.",

  // Supported Railway Quotas
  quotas: [
    { code: "GN", name: "General Quota", description: "Standard reservation quota for all travelers" },
    { code: "TQ", name: "Tatkal Quota", description: "Last-minute emergency quota (max 4 passengers)" },
    { code: "PT", name: "Premium Tatkal", description: "Dynamic surge-priced emergency quota" },
    { code: "LD", name: "Ladies Quota", description: "Reserved for solo female travelers or with children < 12" },
    { code: "SS", name: "Lower Berth / Sr. Citizen", description: "Reserved for senior citizens (men 60+, women 45+)" },
    { code: "HP", name: "Divyangjan", description: "Specially abled travelers with valid railway concession ID" },
  ],

  // Supported Travel Classes
  travelClasses: [
    { code: "ALL", name: "All Classes", iconName: "Layers" },
    { code: "1A", name: "AC First Class (1A)", description: "Private lockable coupe with bedding and meals" },
    { code: "2A", name: "AC 2-Tier (2A)", description: "Air-conditioned 2-tier berths with privacy curtains" },
    { code: "3A", name: "AC 3-Tier (3A)", description: "Comfortable air-conditioned 3-tier berths" },
    { code: "3E", name: "AC 3 Economy (3E)", description: "Optimized 3-tier AC travel at lower fare" },
    { code: "CC", name: "AC Chair Car (CC)", description: "Air-conditioned plush reclining passenger seats" },
    { code: "EC", name: "Exec. Chair Car (EC)", description: "Executive 2x2 spacious seats on Vande Bharat/Shatabdi" },
    { code: "SL", name: "Sleeper Class (SL)", description: "Non-AC budget open-window sleeping berths" },
    { code: "2S", name: "Second Sitting (2S)", description: "Daytime reserved cushioned seating" },
  ],

  // Popular Route Shortcuts
  popularRoutes: [
    { fromCode: "NDLS", fromName: "New Delhi", toCode: "MMCT", toName: "Mumbai Central", duration: "15h 32m", type: "Rajdhani" },
    { fromCode: "MAS", fromName: "Chennai Central", toCode: "SBC", toName: "Bengaluru", duration: "4h 30m", type: "Vande Bharat" },
    { fromCode: "NDLS", fromName: "New Delhi", toCode: "BSB", toName: "Varanasi", duration: "8h 00m", type: "Vande Bharat" },
    { fromCode: "CSMT", fromName: "Mumbai", toCode: "PUNE", toName: "Pune", duration: "3h 15m", type: "Deccan Queen" },
    { fromCode: "HWH", fromName: "Howrah (Kolkata)", toCode: "NDLS", toName: "New Delhi", duration: "17h 05m", type: "Rajdhani" },
  ]
};
