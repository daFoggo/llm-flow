"use client";

import {
  Copy,
  MessagesSquare,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { CardContent } from "@/components/ui/card";
import { useDocuments } from "../hooks/use-documents";
import { ResponsiveBlock } from "./responsive-block";

type ConversationManagementBlockProps = {
  className?: string;
};

export const ConversationManagementBlock = ({
  className,
}: ConversationManagementBlockProps) => {
  const contextAction = (
    <Context
      usedTokens={8192}
      maxTokens={128000}
      modelId="gpt-4-turbo"
      usage={{
        inputTokens: 8192,
        inputTokenDetails: {
          noCacheTokens: 8192,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
        },
        outputTokens: 0,
        outputTokenDetails: {
          textTokens: 0,
          reasoningTokens: 0,
        },
        totalTokens: 8192,
      }}
    >
      <ContextTrigger className="" />
      <ContextContent align="end">
        <ContextContentHeader />
        <ContextContentBody className="space-y-2">
          <ContextInputUsage />
          <ContextCacheUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  );

  return (
    <ResponsiveBlock
      title="Conversation"
      icon={MessagesSquare}
      minimizable={false}
      className={className}
      headerAction={contextAction}
      cardContent={<ConversationManagementCardContent />}
    />
  );
};

// Sample data for demonstration
const SAMPLE_MESSAGES = [
  {
    id: "1",
    role: "assistant" as const,
    content:
      "Hello! I'm your AI assistant. I can help you analyze documents, answer questions, and assist with your tasks. How can I help you today?",
  },
];

type MessageType = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const ConversationManagementCardContent = () => {
  const [messages, setMessages] = useState<MessageType[]>(SAMPLE_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { documents } = useDocuments();

  const handleSubmit = async (message: PromptInputMessage) => {
    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message.text,
    };
    setMessages((prev) => [...prev, newMessage]);
    setText("");

    // Simulate thinking
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I've received your request. Using the attached documents, I'll analyze the information and provide a detailed response shortly.",
        },
      ]);
    }, 500);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <CardContent className="flex flex-col gap-4 p-0 h-full overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} from={msg.role}>
            <MessageContent>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                  <Sparkles className="size-3 text-primary" />
                  <span>AI Assistant</span>
                </div>
              )}
              {msg.content}
            </MessageContent>
            {msg.role === "assistant" && (
              <MessageActions>
                <MessageAction tooltip="Copy response">
                  <Copy className="size-3" />
                </MessageAction>
                <MessageAction tooltip="Regenerate">
                  <RefreshCw className="size-3" />
                </MessageAction>
                <div className="flex-1" />
                <MessageAction tooltip="Good response">
                  <ThumbsUp className="size-3" />
                </MessageAction>
                <MessageAction tooltip="Bad response">
                  <ThumbsDown className="size-3" />
                </MessageAction>
              </MessageActions>
            )}
          </Message>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm p-4">
            <Sparkles className="size-4 animate-pulse" />
            <Shimmer className="text-sm">Thinking...</Shimmer>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <PromptInput onSubmit={handleSubmit} className="w-full" multiple>
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              ref={textareaRef}
              value={text}
              placeholder="Ask a question..."
              disabled={documents.length === 0 || isLoading}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools></PromptInputTools>
            <PromptInputSubmit
              disabled={!text && !isLoading}
              status={isLoading ? "streaming" : "ready"}
            />
          </PromptInputFooter>
        </PromptInput>
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            AI errors can occur. Check important info.
          </p>
        </div>
      </div>
    </CardContent>
  );
};
