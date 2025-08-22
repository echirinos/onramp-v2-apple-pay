import React, { useState, useCallback, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";

type CustomInputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  style,
  onChangeText,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  // Update internal value when prop value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounced onChange handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onChangeText && inputValue !== value) {
        onChangeText(inputValue);
      }
    }, 100); // Reduced from 300ms to 100ms for faster response

    return () => clearTimeout(timeoutId);
  }, [inputValue, onChangeText, value]);

  const handleTextChange = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <TextInput
          {...props}
          value={inputValue}
          style={[styles.input, style]}
          onChangeText={handleTextChange}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0B0D",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E6EAEE",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "rgba(0, 0, 0, 0.04)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: "#0052FF",
    borderWidth: 2,
    shadowColor: "rgba(0, 82, 255, 0.15)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: "#D73A49",
    borderWidth: 2,
    shadowColor: "rgba(215, 58, 73, 0.15)",
  },
  input: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0A0B0D",
    padding: 0,
    minHeight: 32,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  errorText: {
    fontSize: 14,
    color: "#D73A49",
    marginTop: 8,
    fontWeight: "500",
    textAlign: "left",
  },
});
