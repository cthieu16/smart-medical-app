import { AntDesign, Feather } from "@expo/vector-icons";

type IconName = keyof typeof AntDesign.glyphMap | keyof typeof Feather.glyphMap;

export type NavItem = {
  id: string;
  name: string;
  icon: IconName;
  routes: string[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    name: "Trang chủ",
    icon: "home",
    routes: ["/(protected)/home"],
  },
  {
    id: "shop",
    name: "Bệnh án",
    icon: "file-text",
    routes: ["/(protected)/categories", "/(protected)/product-list"],
  },
  {
    id: "cart",
    name: "Lịch hẹn",
    icon: "calendar",
    routes: ["/(protected)/cart"],
  },
  {
    id: "favorites",
    name: "Thông báo",
    icon: "bell",
    routes: ["/(protected)/favorites"],
  },
  {
    id: "profile",
    name: "Trang cá nhân",
    icon: "user",
    routes: ["/(protected)/profile"],
  },
];
