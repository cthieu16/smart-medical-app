import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { SecondaryButton } from "../components/Buttons/SecondaryButton";
import { SocialButton } from "../components/Buttons/SocialButton";
import { useFacebookAuth } from "../hooks/useFacebookAuth";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

type AppRoutes = "/register" | "/login";

const Index = () => {
  const router = useRouter();
  const { promptAsyncGoogle } = useGoogleAuth();
  const { promptAsyncFacebook } = useFacebookAuth();

  const logoPosition = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: logoPosition.value }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  useEffect(() => {
    logoPosition.value = withTiming(-20, { duration: 1000 });
    contentOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []);

  const handleNavigation = (route: AppRoutes) => {
    router.push(route);
  };

  return (
    <View className="flex-1 bg-[#7CB9E8]">
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(2,3,3,4)"]}
        locations={[0.15, 0.6]}
        className="pb-12"
      >
        <View className="h-full pb-12">
          <View className="px-8">
            <Animated.View className="items-center mt-32" style={logoStyle}>
              <Image
                source={require("../assets/images/logo-mdc.jpg")}
                className="w-24 h-24 mb-6"
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View
              className="items-center w-full mt-4"
              style={contentStyle}
            >
              <Text className="mb-2 text-4xl text-center text-white font-poppins-bold">
                Medic
              </Text>
              <Text className="mb-8 font-sans text-lg text-center text-white opacity-80">
                Phục vụ sức khỏe cộng đồng
              </Text>
            </Animated.View>

            <Animated.View className="w-full mt-auto" style={contentStyle}>
              <View className="flex flex-col gap-2">
                <PrimaryButton
                  title="Đăng ký"
                  onPress={() => handleNavigation("/register")}
                />

                <SocialButton
                  title="Google"
                  icon="google"
                  onPress={() => promptAsyncGoogle()}
                />

                <SocialButton
                  title="Facebook"
                  icon="facebook"
                  onPress={() => promptAsyncFacebook()}
                />

                <SecondaryButton
                  title="Đăng nhập"
                  onPress={() => handleNavigation("/login")}
                />
              </View>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export { Index as default };
