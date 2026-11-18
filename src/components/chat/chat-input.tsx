import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, FontSizes, Radius, Spacing } from '@/theme';

const PLACEHOLDER_COLOR = `${Colors.text}99`;

export function ChatInput({
  value,
  onChangeText,
  onSend,
  disabled,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Message input"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        placeholderTextColor={PLACEHOLDER_COLOR}
        multiline
      />
      <Pressable
        accessibilityLabel="Send message"
        accessibilityRole="button"
        disabled={!canSend}
        onPress={onSend}
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}>
        <Text style={styles.sendText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    color: Colors.text,
    fontSize: FontSizes.md,
  },
  sendButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: Colors.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
