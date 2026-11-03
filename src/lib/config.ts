export const BRAND = "Tropical Shipping";

// Default amount in USD for each new booking (editable per booking in Admin)
export const BOOKING_FEE = 150;
// Price per destination in USD. Destinations not listed use BOOKING_FEE.
export const PRICES: Record<string, number> = {
  // "Guyana": 0,  // <- put your real price, then remove the //
};

export function priceFor(destination: string): number {
  return PRICES[destination] ?? BOOKING_FEE;
}
// Your contact details (shown in the footer)
export const CONTACT = {
  email: "tropicalshipping286@gmail.com",
  phone: "+1 (305) 000-0000",
  address: "Miami, Florida",
};

export const ORIGINS = ["Miami, FL"];

// The islands you serve
export const DESTINATIONS = [
  "Jamaica",
  "Haiti",
  "Bahamas",
  "Trinidad and Tobago",
  "Barbados",
  "Dominican Republic",
  "Cayman Islands",
  "Turks and Caicos",
  "Saint Lucia",
  "Grenada",
  "Guyana",
  "Antigua and Barbuda",
];

export const STATUSES = [
  "Received",
  "Loaded",
  "Shipped",
  "Arrived at port",
  "Customs",
  "Out for delivery",
  "Delivered",
] as const;

export const STATUS_HINT: Record<string, string> = {
  Received: "We have your shipment and your payment",
  Loaded: "Your cargo has been loaded for departure",
  Shipped: "Your cargo is on its way from Miami",
  "Arrived at port": "Your cargo has arrived at the destination port",
  Customs: "Clearing customs at the destination",
  "Out for delivery": "Your cargo is on its way to you",
  Delivered: "Your shipment has been delivered",
};

// Your payment details (shown to customers on the payment page)
export const PAYMENT_METHODS = [
  {
    id: "bank",
    label: "Bank Transfer",
    details: ["Bank: YOUR BANK NAME", "Account name: YOUR NAME", "Account number: 0000000000"],
  },
  { id: "zelle", label: "Zelle", details: ["Send to: your-email-or-phone"] },
  { id: "cashapp", label: "CashApp", details: ["Cashtag: $YourCashtag"] },
  { id: "chime", label: "Chime", details: ["ChimeSign: $YourChimeSign"] },
];