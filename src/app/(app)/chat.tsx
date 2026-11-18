import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { ChatInput } from '@/components/chat/chat-input';
import { MessageList } from '@/components/chat/message-list';
import type { ChatMessage } from '@/components/chat/types';
import { Colors } from '@/theme';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'seed-1',
    role: 'assistant',
    text: "Hi! I'm here to help you think through what happened. Was it repeated?",
  },
];

const FAKE_REPLIES = [
  'Thanks for sharing that. Did it make you feel unsafe?',
  'I hear you. Was this witnessed by others, or did it happen in private?',
  "That sounds really hard. You're doing the right thing by talking about it.",
];

const REPLY_DELAY_MS = 1500;

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const replyIndexRef = useRef(0);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;

    setMessages((previous) => [...previous, { id: nextId(), role: 'user', text }]);
    setDraft('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = FAKE_REPLIES[replyIndexRef.current % FAKE_REPLIES.length];
      replyIndexRef.current += 1;
      setIsTyping(false);
      setMessages((previous) => [...previous, { id: nextId(), role: 'assistant', text: reply }]);
    }, REPLY_DELAY_MS);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <MessageList messages={messages} isTyping={isTyping} />
        <ChatInput value={draft} onChangeText={setDraft} onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
