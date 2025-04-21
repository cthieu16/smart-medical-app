import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View, StatusBar, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  transparentBackground?: boolean;
  accentColor?: string;
  subtitle?: string;
};

/**
 * Header component that supports transparent mode and custom right icon
 */
export const Header = ({
  title,
  showBackButton = true,
  showSearchButton = false,
  rightIcon,
  onRightPress,
  transparentBackground = false,
  accentColor = "#4A90E2",
  subtitle,
}: HeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="bg-black"
    >
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />

      {transparentBackground ? (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {showBackButton && (
              <Pressable
                onPress={() => router.back()}
                className="mr-3 w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                hitSlop={8}
              >
                <AntDesign name="arrowleft" size={spacing.iconSize.medium} color={colors.text.primary} />
              </Pressable>
            )}
            <View>
              <Text className="text-xl font-bold text-white">{title}</Text>
              {subtitle ? (
                <Text className="text-sm text-gray-400">{subtitle}</Text>
              ) : null}
            </View>
          </View>

          {rightIcon ? (
            <Pressable onPress={onRightPress} hitSlop={8}>
              {rightIcon}
            </Pressable>
          ) : showSearchButton && (
            <Pressable
              onPress={() => console.log("search")}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              hitSlop={8}
            >
              <Feather name="search" size={spacing.iconSize.medium} color={colors.text.primary} />
            </Pressable>
          )}
        </View>
      ) : (
        <View className="bg-black">
          <View className="flex-row items-center justify-between px-6 py-3">
            <View className="flex-row items-center">
              {showBackButton && (
                <Pressable
                  onPress={() => router.back()}
                  className="mr-3 bg-[#21262D] w-10 h-10 rounded-full items-center justify-center"
                  hitSlop={8}
                >
                  <AntDesign name="arrowleft" size={spacing.iconSize.medium} color={accentColor} />
                </Pressable>
              )}
              <View className="flex-row items-center">
                <View
                  className="w-1 h-5 rounded-full mr-2"
                  style={{ backgroundColor: accentColor }}
                />
                <View>
                  <Text className="text-lg font-bold text-white">{title}</Text>
                  {subtitle ? (
                    <Text className="text-sm text-gray-400">{subtitle}</Text>
                  ) : null}
                </View>
              </View>
            </View>

            {rightIcon ? (
              <Pressable onPress={onRightPress} hitSlop={8}>
                {rightIcon}
              </Pressable>
            ) : showSearchButton && (
              <Pressable
                onPress={() => console.log("search")}
                className="bg-[#21262D] w-10 h-10 rounded-full items-center justify-center"
                hitSlop={8}
              >
                <Feather name="search" size={spacing.iconSize.medium} color={accentColor} />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </Animated.View>
  );
};
