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
    routes: ["/(protected)/home", "/(protected)/checkout", "/(protected)/success", "/(protected)/orders"],
  },
  {
    id: "appointments",
    name: "Lịch hẹn",
    icon: "calendar",
    routes: [
      "/(protected)/appointments",
      "/(protected)/appointments-create",
      "/(protected)/appointments-detail"
    ],
  },
  {
    id: "medical-records",
    name: "Bệnh án",
    icon: "file-text",
    routes: [
      "/(protected)/medical-records",
      "/(protected)/medical-records-detail"
    ],
  },
  {
    id: "notifications",
    name: "Thông báo",
    icon: "bell",
    routes: ["/(protected)/notifications"],
  },
  {
    id: "profile",
    name: "Trang cá nhân",
    icon: "user",
    routes: [
      "/(protected)/profile",
      "/(protected)/settings",
      "/(protected)/map"
    ],
  },
];
