import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DynamicTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  minHeight?: number;
  maxHeight?: number;
  style?: any;
  placeholderTextColor?: string;
}

export default function DynamicTextInput({
  value,
  onChangeText,
  placeholder = 'Digite aqui...',
  multiline = true,
  minHeight = 80,
  maxHeight = 300,
  style,
  placeholderTextColor = '#7B68EE',
}: DynamicTextInputProps) {
  const [height, setHeight] = useState(minHeight);

  const handleContentSizeChange = useCallback(
    (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, contentHeight + 20));
      setHeight(newHeight);
    },
    [minHeight, maxHeight]
  );

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.95)', 'rgba(15, 52, 96, 0.85)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.border}>
          <LinearGradient
            colors={['rgba(0, 229, 255, 0.3)', 'rgba(123, 104, 238, 0.2)', 'rgba(32, 178, 170, 0.25)']}
            style={styles.borderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.inputContainer, { height }]}>
              {/* Hidden text for height calculation */}
              <Text style={[styles.hiddenText, { height: 0, opacity: 0 }]}>
                {value || placeholder}
              </Text>
              
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                multiline={multiline}
                onContentSizeChange={handleContentSizeChange}
                textAlignVertical="top"
                scrollEnabled={height >= maxHeight}
              />
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flex: 1,
  },
  border: {
    padding: 1.5,
    flex: 1,
  },
  borderGradient: {
    borderRadius: 14.5,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 13,
    margin: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  hiddenText: {
    fontSize: 16,
    color: 'transparent',
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    lineHeight: 22,
  },
  textInput: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    flex: 1,
    textAlignVertical: 'top',
  },
});