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
          placeholderTextColor="#8A92B2"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  inputContainerFocused: {
    borderColor: "#667eea",
    shadowColor: "#667eea",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  inputContainerError: {
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
  },
  input: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    padding: 0,
    minHeight: 28,
    textAlign: "center",
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 6,
    fontWeight: "600",
    textAlign: "center",
  },
});
