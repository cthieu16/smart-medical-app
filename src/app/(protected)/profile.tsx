import { AntDesign, Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  ScrollView, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../hooks/useOrders";
import { Header } from "@/src/components/Header/Header";
import Animated, { FadeInDown, FadeInRight, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { useMyAppointments } from "@/src/hooks/useAppointments";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";

const { width } = Dimensions.get('window');
const ANIMATION_DELAY_BASE = 50;

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconType: "Feather" | "MaterialCommunityIcons" | "Ionicons";
  color: string;
  route: string;
  badge?: number;
}

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: orders = [] } = useOrders();
  const { data: appointments = [] } = useMyAppointments();
  const { data: medicalRecords = [] } = useMedicalRecords();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const stats = [
    {
      id: "orders",
      title: "Đơn thuốc",
      count: orders.length,
      icon: "pill",
      color: colors.primary.main
    },
    {
      id: "appointments",
      title: "Lịch hẹn",
      count: appointments.length,
      icon: "calendar",
      color: colors.accent.main
    },
    {
      id: "records",
      title: "Bệnh án",
      count: medicalRecords.length,
      icon: "file-document-outline",
      color: colors.secondary.main
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: "appointments",
      title: "Lịch hẹn",
      subtitle: "Quản lý lịch hẹn khám bệnh",
      icon: "calendar",
      iconType: "Feather",
      color: colors.primary.main,
      route: "/(protected)/appointments",
      badge: appointments?.filter(a => a.status === "PENDING").length || 0
    },
    {
      id: "medical-records",
      title: "Hồ sơ bệnh án",
      subtitle: "Xem thông tin bệnh án của bạn",
      icon: "file-document-outline",
      iconType: "MaterialCommunityIcons",
      color: colors.secondary.main,
      route: "/(protected)/medical-records"
    },
    {
      id: "prescriptions",
      title: "Đơn thuốc",
      subtitle: "Xem đơn thuốc và lịch sử dùng thuốc",
      icon: "pill",
      iconType: "MaterialCommunityIcons",
      color: colors.purple.main,
      route: "/(protected)/orders",
      badge: orders?.filter(o => o.status === "NEW" as any).length || 0
    },
    {
      id: "map",
      title: "Bản đồ",
      subtitle: "Tìm địa điểm phòng khám gần bạn",
      icon: "map",
      iconType: "Feather",
      color: colors.accent.main,
      route: "/(protected)/map"
    },
    {
      id: "notifications",
      title: "Thông báo",
      subtitle: "Xem các thông báo và cập nhật",
      icon: "bell",
      iconType: "Feather",
      color: colors.pink.main,
      route: "/(protected)/notifications",
      badge: 2
    },
    {
      id: "settings",
      title: "Cài đặt tài khoản",
      subtitle: "Cập nhật thông tin cá nhân và mật khẩu",
      icon: "settings",
      iconType: "Feather",
      color: colors.text.secondary,
      route: "/(protected)/settings"
    },
  ];

  const renderIcon = (item: MenuItem): React.ReactNode => {
    const Icon = (() => {
      switch (item.iconType) {
        case "Feather":
          return Feather;
        case "MaterialCommunityIcons":
          return MaterialCommunityIcons;
        case "Ionicons":
          return Ionicons;
        default:
          return Feather;
      }
    })();

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Icon 
          name={item.icon as any} 
          size={spacing.iconSize.medium} 
          color={item.color} 
        />
      </View>
    );
  };

  const renderStatIcon = (stat: typeof stats[0]): React.ReactNode => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons 
          name={stat.icon as any} 
          size={16} 
          color={stat.color} 
        />
      </View>
    );
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    router.replace("/");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header 
        title="Thông tin cá nhân" 
        showSearchButton={false} 
        accentColor={colors.primary.main}
      />

      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Profile Card */}
        <Animated.View 
          entering={FadeInDown.delay(ANIMATION_DELAY_BASE).duration(400)}
          style={styles.profileCardContainer}
        >
          <LinearGradient
            colors={["#21262D", "#0D1117"]}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("../../assets/images/user.png")}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <View 
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: colors.secondary.main }
                  ]} 
                />
              </View>
              
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>
                  {user?.fullName || "Người dùng"}
                </Text>
                <Text style={styles.userEmail}>
                  {user?.email || "email@example.com"}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push("/(protected)/settings" as any)}
                hitSlop={spacing.xs}
              >
                <View>
                  <Feather 
                    name="edit-2" 
                    size={spacing.iconSize.small} 
                    color={colors.primary.main} 
                  />
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Statistics */}
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <React.Fragment key={stat.id}>
                  {index > 0 && (
                    <View style={styles.statDivider} />
                  )}
                  <TouchableOpacity
                    style={styles.statItem}
                    onPress={() => {
                      const route = (() => {
                        if (stat.id === "orders") return "/(protected)/orders";
                        if (stat.id === "appointments") return "/(protected)/appointments";
                        if (stat.id === "records") return "/(protected)/medical-records";
                        return "";
                      })();
                      if (route) router.push(route as any);
                    }}
                    activeOpacity={0.7}
                  >
                    <View 
                      style={[
                        styles.statIconContainer,
                        { backgroundColor: stat.color + '20' }
                      ]}
                    >
                      {renderStatIcon(stat)}
                    </View>
                    <Text style={styles.statValue}>{stat.count}</Text>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View 
          entering={FadeInDown.delay(ANIMATION_DELAY_BASE + 100).duration(400)}
          style={styles.menuContainer}
        >
          <Text style={styles.menuTitle}>
            MENU CHÍNH
          </Text>

          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <Animated.View 
                key={item.id}
                entering={FadeInUp.delay((index % 2) * 100 + ANIMATION_DELAY_BASE + 150).duration(400)}
                style={styles.menuItemWrapper}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    router.push(item.route as any);
                  }}
                  activeOpacity={0.7}
                >
                  <View 
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: item.color + '15' }
                    ]}
                  >
                    {renderIcon(item)}
                    {item.badge && item.badge > 0 && (
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* App Info & Logout */}
        <Animated.View 
          entering={FadeInDown.delay(ANIMATION_DELAY_BASE + 300).duration(400)}
          style={styles.footerContainer}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <View>
              <Feather name="log-out" size={18} color={colors.danger.main} />
            </View>
            <Text style={styles.logoutButtonText}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
          
          <View style={styles.appInfoContainer}>
            <Image 
              source={require('../../assets/images/logo-mdc.jpg')}
              style={styles.appLogo}
            />
            <Text style={styles.versionText}>
              Phiên bản 1.0.0
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <Animated.View 
          entering={FadeInDown.duration(300)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Đăng xuất
            </Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>
                  Hủy
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>
                  Đăng xuất
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileCardContainer: {
    marginHorizontal: spacing.screenMargin,
    marginTop: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileCard: {
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  userInfoContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  editButton: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.xs,
    borderRadius: spacing.borderRadius.circle,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: spacing.md + 4,
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statDivider: {
    height: '70%',
    width: 1,
    alignSelf: 'center',
    backgroundColor: colors.border.main,
  },
  statIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  menuContainer: {
    marginHorizontal: spacing.screenMargin,
    marginTop: spacing.xl,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItemWrapper: {
    width: (width - (spacing.screenMargin * 2 + spacing.md)) / 2,
    marginBottom: spacing.md,
  },
  menuItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    height: 135,
    justifyContent: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.text.primary,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'center',
  },
  footerContainer: {
    marginHorizontal: spacing.screenMargin,
    marginTop: spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.danger.main,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
  },
  logoutButtonText: {
    color: colors.danger.main,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  appLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: spacing.xs,
  },
  versionText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.borderRadius.lg,
    width: '85%',
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalMessage: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginVertical: spacing.md,
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background.tertiary,
    marginRight: spacing.xs,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: colors.danger.main,
    marginLeft: spacing.xs,
  },
  confirmButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default ProfileScreen;
