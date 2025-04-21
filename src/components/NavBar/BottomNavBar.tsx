import { AntDesign, Feather } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform
} from "react-native";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import { NAV_ITEMS, NavItem } from "../../constants/navItems";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavItemProps = NavItem & {
  isActive: boolean;
  onPress: () => void;
};

const NavBarItem = ({ name, icon, isActive, onPress }: NavItemProps) => {
  const IconComponent = icon in AntDesign.glyphMap ? AntDesign : Feather;

  // Animation for icon when pressed
  const iconScale = useSharedValue(1);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }]
    };
  });

  const handlePress = () => {
    // Animate icon when pressed
    iconScale.value = withTiming(0.8, { duration: 50 }, () => {
      iconScale.value = withTiming(1, { duration: 200 });
    });
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <IconComponent
          name={icon as any}
          size={24}
          color={isActive ? "#4A90E2" : "#666"}
        />
        {isActive && <View style={styles.activeIndicator} />}
      </Animated.View>
      <Text style={[
        styles.navText,
        isActive ? styles.activeText : styles.inactiveText
      ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export const BottomNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    // Xử lý cập nhật active tab mỗi khi pathname thay đổi
    const currentTab = getActiveTabFromPath(pathname);
    // Console log để debug
    console.log("Current pathname:", pathname);
    console.log("Detected active tab:", currentTab);
    setActiveTab(currentTab);
  }, [pathname]);

  // Cách đơn giản nhất để xác định tab hiện tại
  const getActiveTabFromPath = (path: string): string => {
    // Bảo vệ trường hợp path undefined hoặc null
    if (!path) return "home";

    // Loại bỏ query params và hash
    path = path.split('?')[0].split('#')[0];

    // Thêm log chi tiết hơn để xác định vấn đề
    console.log("Clean path for tab detection:", path);

    // Xử lý đường dẫn "/profile" trước tiên
    if (path === "/(protected)/profile" || path.endsWith("/profile")) {
      console.log("Matched profile path directly");
      return "profile";
    }

    // Kiểm tra các đường dẫn đặc biệt trước (thứ tự quan trọng)
    if (path.includes("settings") || path.includes("map")) {
      console.log("Matched profile path via settings/map");
      return "profile";
    }

    if (path.includes("appointments")) {
      return "appointments";
    }

    if (path.includes("medical-records")) {
      return "medical-records";
    }

    if (path.includes("notifications")) {
      return "notifications";
    }

    // Kiểm tra cụ thể cho profile (thêm một lần nữa để đảm bảo)
    if (path.includes("profile")) {
      console.log("Matched profile path via includes");
      return "profile";
    }

    if (path.includes("checkout") || path.includes("success") || path.includes("orders")) {
      return "home";
    }

    // Mặc định sẽ là home nếu không khớp với bất kỳ quy tắc nào
    return "home";
  };

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, 10) }
    ]}>
      {NAV_ITEMS.map((item) => (
        <NavBarItem
          key={item.id}
          {...item}
          isActive={item.id === activeTab}
          onPress={() => router.push(item.routes[0] as any)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  iconContainer: {
    marginBottom: 4,
    position: 'relative',
    padding: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2',
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
  },
  activeText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  inactiveText: {
    color: '#666',
  },
});
