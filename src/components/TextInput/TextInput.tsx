import React from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
} from "react-native";

type CustomTextInputProps = TextInputProps & {
  label: string;
};

const TextInput = ({ label, ...props }: CustomTextInputProps) => {
  return (
    <View>
      <Text className="mb-2 text-base text-white">{label}</Text>
      <RNTextInput
        className="bg-[#0D1117] text-white px-4 py-4 rounded-xl"
        placeholderTextColor="#666"
        style={{ textAlign: 'left' }}
        {...props}
      />
    </View>
  );
};

export { TextInput };
