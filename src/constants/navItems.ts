import { AntDesign, Feather } from "@expo/vector-icons";

type IconName = keyof typeof AntDesign.glyphMap | keyof typeof Feather.glyphMap;

export type NavItem = {
  id: string;
  name: string;
  icon: IconName;
  routes: string[];
};

export const NAV_ITEMS: NavItem[] = [
  { id: "home", name: "Home", icon: "home", routes: ["/(protected)/home"] },
  {
    id: "shop",
    name: "Shop",
    icon: "shopping-bag",
    routes: ["/(protected)/categories", "/(protected)/product-list"],
  },
  {
    id: "cart",
    name: "Cart",
    icon: "shopping-cart",
    routes: ["/(protected)/cart"],
  },
  {
    id: "favorites",
    name: "Favorites",
    icon: "heart",
    routes: ["/(protected)/favorites"],
  },
  {
    id: "profile",
    name: "Profile",
    icon: "user",
    routes: ["/(protected)/profile"],
  },
];
