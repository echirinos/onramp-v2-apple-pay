import React, { useState, useCallback, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';

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
  const [inputValue, setInputValue] = useState(value || '');

  // Update internal value when prop value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Debounced onChange handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onChangeText && inputValue !== value) {
        onChangeText(inputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, onChangeText, value]);

  const handleTextChange = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
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
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: '#0052FF',
    shadowColor: '#0052FF',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#FF6B6B',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B1B1B',
    padding: 0,
    minHeight: 24,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    fontWeight: '500',
  },
}); 