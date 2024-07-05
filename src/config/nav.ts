import { SidebarLink } from "@/components/SidebarItems";
import { Cog, HomeIcon, Leaf, List, UserCog } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultManageLinks: SidebarLink[] = [
  { href: "/manage/account", title: "Account", icon: Cog },
  { href: "/manage/settings", title: "Settings", icon: Cog },
];

export const defaultLinks: SidebarLink[] = [
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: UserCog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Manage",
    links: [
      { href: "/manage/dashboard", title: "Dashboard", icon: HomeIcon },
      {
        href: "/manage/categories",
        title: "Categories",
        icon: List,
      },
      {
        href: "/manage/causes",
        title: "Causes",
        icon: Leaf,
      },
    ],
  },
];
