import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
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

  // Animation values
  const logoPosition = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  // Animation styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoPosition.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // Trigger animations safely
  useEffect(() => {
    const timer = setTimeout(() => {
      logoPosition.value = withTiming(-20, { duration: 1000 });
      contentOpacity.value = withDelay(700, withTiming(1, { duration: 800 }));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Navigation handlers
  const handleNavigation = useCallback((route: AppRoutes) => {
    router.push(route);
  }, [router]);

  const handleGoogleLogin = useCallback(() => {
    promptAsyncGoogle();
  }, [promptAsyncGoogle]);

  const handleFacebookLogin = useCallback(() => {
    promptAsyncFacebook();
  }, [promptAsyncFacebook]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(2,3,3,0.9)"]}
        locations={[0.15, 0.6]}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          <View style={styles.innerContainer}>
            {/* Logo Animation */}
            <Animated.View style={[styles.logoContainer, logoStyle]}>
              <Image
                source={require("../assets/images/logo-mdc.jpg")}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Text Animation */}
            <Animated.View style={[styles.textContainer, contentStyle]}>
              <Text style={styles.title}>Medic</Text>
              <Text style={styles.subtitle}>
                Phục vụ sức khỏe cộng đồng
              </Text>
            </Animated.View>

            {/* Buttons Animation */}
            <Animated.View style={[styles.buttonsContainer, contentStyle]}>
              <View style={styles.buttonsWrapper}>
                <PrimaryButton
                  title="Đăng ký"
                  onPress={() => handleNavigation("/register")}
                />

                <SocialButton
                  title="Google"
                  icon="google"
                  onPress={handleGoogleLogin}
                />

                <SocialButton
                  title="Facebook"
                  icon="facebook"
                  onPress={handleFacebookLogin}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7CB9E8',
  },
  gradient: {
    flex: 1,
    paddingBottom: 48,
  },
  contentContainer: {
    height: '100%',
    paddingBottom: 48,
  },
  innerContainer: {
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 128,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 24,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  buttonsWrapper: {
    flexDirection: 'column',
    gap: 8,
  },
});

export { Index as default };
