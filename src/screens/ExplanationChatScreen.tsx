/**
 * ExplanationChatScreen - Full page chat for spot explanations
 * "Dark Confidence" design
 * 
 * V1: Static explanation + disabled input
 * V2: Will integrate LLM for interactive Q&A
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { SpotMeta } from "../types/spot";

// Define the params this screen expects
export type ExplanationChatParams = {
  meta?: SpotMeta;
  tags?: string[];
  heroPosition: string;
  street: string;
  isCorrect: boolean;
  selectedAction: string;
  correctAction: string;
};

interface ExplanationChatScreenProps {
  route: {
    params: ExplanationChatParams;
  };
  navigation: any;
}

interface ChatMessage {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
}

export const ExplanationChatScreen: React.FC<ExplanationChatScreenProps> = ({
  route,
  navigation,
}) => {
  const { meta, tags, heroPosition, street, isCorrect, selectedAction, correctAction } = route.params;
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Generate initial AI message from meta
  useEffect(() => {
    const initialMessage = generateInitialMessage();
    setMessages([
      {
        id: "1",
        type: "ai",
        content: initialMessage,
        timestamp: new Date(),
      },
    ]);

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const generateInitialMessage = (): string => {
    const parts: string[] = [];

    // Opening based on result
    if (isCorrect) {
      parts.push(`Great choice! ${selectedAction} is indeed the solver's preferred line here.`);
    } else {
      parts.push(`Let me explain why ${correctAction} is preferred over ${selectedAction} in this spot.`);
    }

    // Add summary if available
    if (meta?.summary) {
      parts.push(`\n\n${meta.summary}`);
    }

    // Add key points
    if (meta?.solverNotes && meta.solverNotes.length > 0) {
      parts.push("\n\n**Key strategic points:**");
      meta.solverNotes.forEach((note) => {
        parts.push(`\n• ${note}`);
      });
    }

    // Add concepts
    const allTags = [...(meta?.concept || []), ...(tags || [])];
    if (allTags.length > 0) {
      parts.push(`\n\n**Concepts:** ${allTags.join(", ")}`);
    }

    // Fallback if no meta
    if (!meta?.summary && (!meta?.solverNotes || meta.solverNotes.length === 0)) {
      return `This ${street} spot from ${heroPosition} position involves a complex decision tree. While detailed analysis isn't available for this specific spot, the solver prefers ${correctAction} based on range composition and equity considerations.\n\nInteractive explanations with AI analysis are coming soon!`;
    }

    return parts.join("");
  };

  const renderMessage = (message: ChatMessage) => {
    const isAI = message.type === "ai";

    return (
      <View
        key={message.id}
        style={[styles.messageBubble, isAI ? styles.aiMessage : styles.userMessage]}
      >
        {isAI && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>♠</Text>
          </View>
        )}
        <View style={[styles.messageContent, isAI ? styles.aiContent : styles.userContent]}>
          {isAI && <Text style={styles.aiLabel}>RangeLab AI</Text>}
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {formatMessage(message.content)}
          </Text>
        </View>
      </View>
    );
  };

  // Simple markdown-like formatting
  const formatMessage = (text: string) => {
    // For now, just return plain text
    // In v2, we can add rich formatting
    return text.replace(/\*\*(.*?)\*\*/g, "$1");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Spot Analysis</Text>
          <Text style={styles.headerSubtitle}>{heroPosition} • {street}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {messages.map(renderMessage)}
        </Animated.View>
      </ScrollView>

      {/* Input area */}
      <View style={styles.inputContainer}>
        <View style={styles.comingSoonBanner}>
          <Text style={styles.comingSoonIcon}>🔮</Text>
          <Text style={styles.comingSoonText}>Interactive explanations coming soon</Text>
        </View>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about this spot..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={false}
          />
          <Pressable style={styles.sendButton} disabled>
            <Text style={styles.sendIcon}>↑</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 18,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  // Message bubbles
  messageBubble: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.goldDim,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  aiAvatarText: {
    fontSize: 18,
    color: colors.gold,
  },
  messageContent: {
    maxWidth: "85%",
    borderRadius: 16,
    padding: 14,
  },
  aiContent: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 4,
  },
  userContent: {
    backgroundColor: colors.gold,
    borderTopRightRadius: 4,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: colors.textPrimary,
  },
  userText: {
    color: "#000",
  },

  // Input
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  comingSoonBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: colors.goldDim,
    borderRadius: 10,
    gap: 8,
  },
  comingSoonIcon: {
    fontSize: 14,
  },
  comingSoonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gold,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 15,
    color: colors.textMuted,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: "700",
  },
});

