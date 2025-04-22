
export type InvoiceTheme = {
  name: string;
  primary: string;
  background: string;
  text: string;
  accent: string;
  headerBackground?: string;
};

export const invoiceThemes: InvoiceTheme[] = [
  {
    name: "Classic",
    primary: "bg-gray-800",
    background: "bg-white",
    text: "text-gray-800",
    accent: "bg-gray-100",
  },
  {
    name: "Modern",
    primary: "bg-blue-600",
    background: "bg-white",
    text: "text-gray-800",
    accent: "bg-blue-50",
    headerBackground: "bg-blue-600 text-white",
  },
  {
    name: "Professional",
    primary: "bg-purple-600",
    background: "bg-white",
    text: "text-gray-800",
    accent: "bg-purple-50",
    headerBackground: "bg-purple-600 text-white",
  },
  {
    name: "Minimal",
    primary: "bg-gray-600",
    background: "bg-gray-50",
    text: "text-gray-800",
    accent: "bg-white",
  },
  {
    name: "Corporate",
    primary: "bg-green-600",
    background: "bg-white",
    text: "text-gray-800",
    accent: "bg-green-50",
    headerBackground: "bg-green-600 text-white",
  },
];
