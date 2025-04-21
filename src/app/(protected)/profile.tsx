import { Header } from "@/src/components/Header/Header";
import { useMyAppointments } from "@/src/hooks/useAppointments";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { spacing } from "@/src/theme/spacing";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../hooks/useOrders";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const ANIMATION_DELAY_BASE = 50;

// Safely render icon to avoid text string warnings
const renderFeatherIcon = (name: string, size: number, color: string) => {
  return <Feather name={name as any} size={size} color={color} />;
};

const renderMaterialCommunityIcon = (name: string, size: number, color: string) => {
  return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
};

const renderIonicon = (name: string, size: number, color: string) => {
  return <Ionicons name={name as any} size={size} color={color} />;
};

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const stats = [
    {
      id: "orders",
      title: "Đơn thuốc",
      count: orders.length,
      icon: "pill",
      color: "#4A90E2"
    },
    {
      id: "appointments",
      title: "Lịch hẹn",
      count: appointments.length,
      icon: "calendar",
      color: "#4A90E2"
    },
    {
      id: "records",
      title: "Bệnh án",
      count: medicalRecords.length,
      icon: "file-document-outline",
      color: "#4A90E2"
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: "appointments",
      title: "Lịch hẹn",
      subtitle: "Quản lý lịch hẹn khám bệnh",
      icon: "calendar",
      iconType: "Feather",
      color: "#4A90E2",
      route: "/(protected)/appointments",
      badge: appointments?.filter(a => a.status === "PENDING").length || 0
    },
    {
      id: "medical-records",
      title: "Hồ sơ bệnh án",
      subtitle: "Xem thông tin bệnh án của bạn",
      icon: "file-document-outline",
      iconType: "MaterialCommunityIcons",
      color: "#4A90E2",
      route: "/(protected)/medical-records"
    },
    {
      id: "prescriptions",
      title: "Đơn thuốc",
      subtitle: "Xem đơn thuốc và lịch sử dùng thuốc",
      icon: "pill",
      iconType: "MaterialCommunityIcons",
      color: "#8B5CF6",
      route: "/(protected)/orders",
      badge: orders?.filter(o => o.status === "NEW" as any).length || 0
    },
    {
      id: "map",
      title: "Bản đồ",
      subtitle: "Tìm địa điểm phòng khám gần bạn",
      icon: "map",
      iconType: "Feather",
      color: "#F59E0B",
      route: "/(protected)/map"
    },
    {
      id: "notifications",
      title: "Thông báo",
      subtitle: "Xem các thông báo và cập nhật",
      icon: "bell",
      iconType: "Feather",
      color: "#EC4899",
      route: "/(protected)/notifications",
      badge: 2
    },
    {
      id: "settings",
      title: "Cài đặt tài khoản",
      subtitle: "Cập nhật thông tin cá nhân và mật khẩu",
      icon: "settings",
      iconType: "Feather",
      color: "#6B7280",
      route: "/(protected)/settings"
    },
  ];

  const renderIcon = (item: MenuItem) => {
    switch (item.iconType) {
      case "Feather":
        return renderFeatherIcon(item.icon, spacing.iconSize.medium, item.color);
      case "MaterialCommunityIcons":
        return renderMaterialCommunityIcon(item.icon, spacing.iconSize.medium, item.color);
      case "Ionicons":
        return renderIonicon(item.icon, spacing.iconSize.medium, item.color);
      default:
        return renderFeatherIcon(item.icon, spacing.iconSize.medium, item.color);
    }
  };

  const renderStatIcon = (stat: typeof stats[0]) => {
    return renderMaterialCommunityIcon(stat.icon, 16, stat.color);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowLogoutConfirm(false);

      // Đảm bảo gọi hàm logout từ context và đợi kết quả
      await logout();

      // Sau khi logout thành công, chuyển hướng đến trang đăng nhập
      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không thể đăng xuất, vui lòng thử lại sau."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigateToRoute = (route: string) => {
    if (route) router.push(route as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" />
      <Header
        title="Thông tin cá nhân"
        showSearchButton={false}
        accentColor="#4A90E2"
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
            colors={["#161B22", "#0D1117"]}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("../../assets/images/user.png")}
                  style={[styles.avatar, { borderColor: "#4A90E2" }]}
                  resizeMode="cover"
                />
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: "#4A90E2" }
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
                style={[styles.editButton, { backgroundColor: "#21262D" }]}
                onPress={() => router.push("/(protected)/settings" as any)}
                hitSlop={spacing.xs}
              >
                {renderFeatherIcon("edit-2", spacing.iconSize.small, "#4A90E2")}
              </TouchableOpacity>
            </View>

            {/* Statistics */}
            <View style={[styles.statsContainer, { backgroundColor: "#161B22" }]}>
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
                      if (route) navigateToRoute(route);
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.statIconContainer,
                        { backgroundColor: `${stat.color}20` }
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

        {/* App Info & Logout */}
        <Animated.View
          entering={FadeInDown.delay(ANIMATION_DELAY_BASE + 300).duration(400)}
          style={styles.footerContainer}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutConfirm(true)}
            activeOpacity={0.8}
            disabled={isLoggingOut}
          >
            <View style={styles.logoutButtonIcon}>
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#F87171" />
              ) : (
                <AntDesign name="logout" size={20} color="#F87171" />
              )}
            </View>
            <Text style={styles.logoutButtonText}>
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowLogoutConfirm(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  Đăng xuất
                </Text>
                <Text style={styles.modalMessage}>
                  Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?
                </Text>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowLogoutConfirm(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalCancelButtonText}>Hủy bỏ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalConfirmButton]}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.modalConfirmButtonText}>Đăng xuất</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileCardContainer: {
    marginHorizontal: spacing.screenMargin,
    marginTop: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileCard: {
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#30363D',
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
    borderColor: "#4A90E2",
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'black',
  },
  userInfoContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  editButton: {
    backgroundColor: "#21262D",
    padding: spacing.xs,
    borderRadius: spacing.borderRadius.circle,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: spacing.md + 4,
    backgroundColor: "#161B22",
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#30363D40',
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
    backgroundColor: '#30363D',
  },
  statIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  menuContainer: {
    marginHorizontal: spacing.screenMargin,
    marginTop: spacing.xl,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A1A1AA',
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
    backgroundColor: "#161B22",
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    height: 135,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#30363D40',
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
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#A1A1AA',
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
    backgroundColor: "#161B22",
    borderWidth: 1,
    borderColor: "#F87171",
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
  },
  logoutButtonIcon: {
    marginRight: spacing.xs,
  },
  logoutButtonText: {
    color: "#F87171",
    fontSize: 15,
    fontWeight: '600',
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
    color: '#A1A1AA',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 24,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#A1A1AA',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#21262D',
    padding: 14,
    borderRadius: 12,
    marginRight: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalCancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#F87171',
    padding: 14,
    borderRadius: 12,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;
