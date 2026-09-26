/**
 * Shared CampusClean content used across the public marketing routes.
 * Pricing here is INDICATIVE launch pricing for the public site. Real,
 * admin-configurable pricing will come from the database once Cloud is enabled.
 */

export const BRAND = {
  name: "CampusClean",
  tagline: "Clean Clothes. Less Hassle. Campus Life Made Easy.",
  marketingTagline: "Your Campus Laundry, Reimagined.",
  launchCampus: "NEHU Tura Campus",
  email: "hello@campusclean.in",
  phone: "",
};

export type Service = {
  slug: string;
  name: string;
  description: string;
  unit: "per kg" | "per item" | "fixed";
  indicativePrice: string;
  turnaround: string;
};

export const SERVICES: Service[] = [
  {
    slug: "wash",
    name: "Wash",
    description: "Machine wash with student-safe detergent, sorted by colour and fabric.",
    unit: "per kg",
    indicativePrice: "₹60",
    turnaround: "48 hours",
  },
  {
    slug: "wash-dry",
    name: "Wash + Dry",
    description: "Washed and fully machine dried, no hunting for space on the hostel line.",
    unit: "per kg",
    indicativePrice: "₹80",
    turnaround: "48 hours",
  },
  {
    slug: "wash-iron",
    name: "Wash + Iron",
    description: "Washed, line finished and pressed, folded ready for class.",
    unit: "per kg",
    indicativePrice: "₹100",
    turnaround: "48 hours",
  },
  {
    slug: "wash-dry-iron",
    name: "Wash + Dry + Iron",
    description: "The full service. Everything comes back dry, pressed and folded.",
    unit: "per kg",
    indicativePrice: "₹120",
    turnaround: "48 hours",
  },
  {
    slug: "iron-only",
    name: "Iron Only",
    description: "Already clean? Send it for pressing alone.",
    unit: "per item",
    indicativePrice: "₹12",
    turnaround: "24 hours",
  },
  {
    slug: "express",
    name: "Express Laundry",
    description: "Priority queue for same-day or next-morning turnaround.",
    unit: "per kg",
    indicativePrice: "₹160",
    turnaround: "Same day",
  },
  {
    slug: "delicate",
    name: "Delicate Care",
    description: "Hand-care handling for sarees, woollens and fragile fabrics.",
    unit: "per item",
    indicativePrice: "₹90",
    turnaround: "72 hours",
  },
  {
    slug: "bedding",
    name: "Blanket / Bedsheet",
    description: "Heavy items washed and dried properly, not squeezed into a bucket.",
    unit: "fixed",
    indicativePrice: "₹150",
    turnaround: "72 hours",
  },
  {
    slug: "shoes",
    name: "Shoes / Special Items",
    description: "Sneaker cleaning and other special requests, quoted on intake.",
    unit: "fixed",
    indicativePrice: "₹180",
    turnaround: "72 hours",
  },
];

export const STEPS = [
  {
    title: "Book a pickup",
    body: "Pick your service, quantity, hostel and a pickup slot that fits between classes.",
  },
  {
    title: "We collect from your hostel",
    body: "Our pickup staff scans your order QR at the door, so nothing gets mixed up.",
  },
  {
    title: "Washed, dried, pressed",
    body: "Sorted, cleaned and quality checked at the CampusClean facility.",
  },
  {
    title: "Delivered to your door",
    body: "Folded and packed, delivered back to your hostel in your chosen slot.",
  },
];

export const TRACK_STAGES = [
  "Order Placed",
  "Pickup Scheduled",
  "Picked Up",
  "Received",
  "Sorting",
  "Washing",
  "Drying",
  "Ironing",
  "Quality Check",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

export const FAQS = [
  {
    q: "Where does CampusClean operate right now?",
    a: "We are launching at NEHU Tura Campus first. NEHU Shillong and other universities across Northeast India follow as we grow. You can register from any campus, you will be told when we reach yours.",
  },
  {
    q: "Do I need a university email address?",
    a: "No. You register with your mobile number and your Student or Staff ID. Our team verifies your ID before your first order, and you can optionally upload a photo of your ID card to speed it up.",
  },
  {
    q: "How is my laundry kept separate from everyone else's?",
    a: "Every order gets a unique ID like CC-2026-000001 and a QR code. Staff scan that code at pickup, intake, each processing stage and delivery, so your bag is tracked the whole way.",
  },
  {
    q: "How do I pay?",
    a: "Online payment (UPI, cards, net banking) is being set up. Until the payment gateway is live, orders are handled as pay-on-delivery, we will never show a fake successful payment.",
  },
  {
    q: "What if something is lost or damaged?",
    a: "You can raise a claim from your order page. Every claim is reviewed by a manager and moves through Submitted, Under Review, Approved or Rejected, and Resolved, with the outcome recorded.",
  },
  {
    q: "Can I give special instructions?",
    a: "Yes. Add notes like “no bleach” or “do not iron” to any order, and flag existing stains, tears or missing buttons before pickup so both sides have a record.",
  },
  {
    q: "What does it cost?",
    a: "Indicative launch pricing starts at ₹60 per kg for a plain wash. Final rates are set per campus before launch and always shown in full before you confirm an order.",
  },
  {
    q: "Do you offer plans for regular laundry?",
    a: "Weekly, monthly and hostel saver plans are part of the roadmap. Rewards and referral points are being built in from the start.",
  },
];

export const COVERAGE = [
  {
    university: "North-Eastern Hill University",
    campuses: [
      { name: "Tura Campus", status: "Launching first" },
      { name: "Shillong Campus", status: "Next in line" },
    ],
  },
  {
    university: "Other universities in Northeast India",
    campuses: [{ name: "Requests open", status: "Tell us your campus" }],
  },
];
