import React from "react";
import { Text } from "react-native";

type FormTitleProps = {
  title: string;
};

const FormTitle = ({ title }: FormTitleProps) => {
  return <Text className='mb-8 text-4xl font-bold text-white'>{title}</Text>;
};

export { FormTitle };
