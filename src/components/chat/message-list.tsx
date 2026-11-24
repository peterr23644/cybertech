import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { ScrollViewInstance } from 'react-native';

import { Spacing } from '@/theme';

import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import type { ChatMessage } from './types';

export function MessageList({
  messages,
  isTyping,
}: {
  messages: ChatMessage[];
  isTyping: boolean;
}) {
  const scrollRef = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, isTyping]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: Spacing.md,
  },
});
