import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ProtectedLayout } from "../../layout/ProtectedLayout";

const ProtectedLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href='/' />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};

const ProtectedRouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='home' options={{ headerShown: false }} />
      <Stack.Screen name='categories' options={{ headerShown: false }} />
      <Stack.Screen name='product-list' options={{ headerShown: false }} />
      <Stack.Screen name='product' options={{ headerShown: false }} />
      <Stack.Screen name='cart' options={{ headerShown: false }} />
      <Stack.Screen name='checkout' options={{ headerShown: false }} />
      <Stack.Screen name='success' options={{ headerShown: false }} />
      <Stack.Screen name='favorites' options={{ headerShown: false }} />
      <Stack.Screen name='profile' options={{ headerShown: false }} />
      <Stack.Screen name='settings' options={{ headerShown: false }} />
      <Stack.Screen name='orders' options={{ headerShown: false }} />
      <Stack.Screen name='order-details' options={{ headerShown: false }} />
    </Stack>
  );
};

export default function ProtectedRoutes() {
  return (
    <ProtectedLayoutWrapper>
      <ProtectedRouteLayout />
    </ProtectedLayoutWrapper>
  );
}
