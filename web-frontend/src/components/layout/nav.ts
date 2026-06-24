import {
  LayoutDashboard,
  CreditCard,
  FileText,
  ArrowLeftRight,
  LineChart,
  BookOpen,
  Landmark,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Money",
    items: [
      { label: "Payments", to: "/payments", icon: CreditCard },
      { label: "Invoices", to: "/invoices", icon: FileText },
      { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", to: "/analytics", icon: LineChart },
      { label: "Accounting", to: "/accounting", icon: BookOpen },
      { label: "Credit", to: "/credit", icon: Landmark },
    ],
  },
];

export const settingsItem: NavItem = {
  label: "Settings",
  to: "/settings",
  icon: Settings,
};
