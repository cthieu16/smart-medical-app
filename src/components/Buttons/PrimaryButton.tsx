import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";

type PrimaryButtonProps = {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
};

const PrimaryButton = ({
  onPress,
  title,
  loading = false,
  disabled = false,
}: PrimaryButtonProps) => {
  return (
    <Pressable
      className={`py-4 px-6 rounded-full ${
        disabled || loading ? "bg-gray-400" : "bg-[#4A90E2]"
      }`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-base font-semibold text-center text-white">
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export { PrimaryButton };
