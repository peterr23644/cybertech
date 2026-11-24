import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { ChatInput } from '@/components/chat/chat-input';
import { MessageList } from '@/components/chat/message-list';
import { RetryBanner } from '@/components/chat/retry-banner';
import type { ChatMessage } from '@/components/chat/types';
import { Colors } from '@/theme';
import { sendChatMessage } from '@/utils/chatApi';
import { getSafetyResponse, hasSafetyConcern } from '@/utils/safetyCheck';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'seed-1',
    role: 'assistant',
    text: "Hi! I'm here to help you think through what happened. Was it repeated?",
  },
];

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export default function ChatScreen() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pendingHistory, setPendingHistory] = useState<ChatMessage[] | null>(null);
  const [isStopped, setIsStopped] = useState(false);

  const requestReply = useCallback(
    async (history: ChatMessage[]) => {
      setHasError(false);
      setIsTyping(true);

      const token = await getToken();
      const result = await sendChatMessage(history, token);

      setIsTyping(false);

      if (!result.ok) {
        setHasError(true);
        setPendingHistory(history);
        return;
      }

      if (result.done) {
        setIsStopped(true);
        router.push({
          pathname: '/result',
          params: { summary: result.summary, nextStep: result.nextStep },
        });
        return;
      }

      setMessages((previous) => [
        ...previous,
        { id: nextId(), role: 'assistant', text: result.reply },
      ]);
    },
    [getToken],
  );

  function handleSend() {
    const text = draft.trim();
    if (!text || isTyping || isStopped) return;

    setDraft('');
    const userMessage: ChatMessage = { id: nextId(), role: 'user', text };

    if (hasSafetyConcern(text)) {
      setMessages((previous) => [
        ...previous,
        userMessage,
        { id: nextId(), role: 'assistant', text: getSafetyResponse() },
      ]);
      setHasError(false);
      setIsStopped(true);
      return;
    }

    const history = [...messages, userMessage];
    setMessages(history);
    requestReply(history);
  }

  function handleRetry() {
    if (pendingHistory) requestReply(pendingHistory);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <MessageList messages={messages} isTyping={isTyping} />
        {hasError && <RetryBanner onRetry={handleRetry} />}
        <ChatInput
          value={draft}
          onChangeText={setDraft}
          onSend={handleSend}
          disabled={isTyping || isStopped}
        />
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
