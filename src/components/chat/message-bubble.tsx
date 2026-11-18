import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Colors, FontSizes, Radius, Spacing } from '@/theme';

import type { ChatMessage } from './types';

const ANIMATION_DURATION = 220;

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeInUp.duration(ANIMATION_DURATION)}
      style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser && styles.textUser]}>{message.text}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  bubbleUser: {
    backgroundColor: Colors.accent,
  },
  bubbleAssistant: {
    backgroundColor: Colors.surface,
  },
  text: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  textUser: {
    color: Colors.background,
  },
});
