/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <idk> */
"use client";

import {
  Copy,
  MessagesSquare,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
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
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationSource,
} from "@/components/ai-elements/inline-citation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAttachment,
  MessageContent,
  MessageResponse,
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
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { CardContent } from "@/components/ui/card";
import { BACKEND_IP } from "@/configs/env";
import {
  getNotebookHistoryAction,
  retrieveContextAction,
  sendMessageAction,
} from "../../actions/chat.action";
import type { AIChatMessage } from "../../types/chat";
import { ResponsiveBlock } from "./responsive-block";

type ChatInterfaceProps = {
  className?: string;
  notebookId: number;
  selectedSourceIds?: number[];
};

export const ChatInterface = ({
  className,
  notebookId,
  selectedSourceIds,
}: ChatInterfaceProps) => {
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
      cardContent={
        <ConversationManagementCardContent
          notebookId={notebookId}
          selectedSourceIds={selectedSourceIds}
        />
      }
    />
  );
};

// Start with standard welcome message
const INITIAL_MESSAGES: MessageType[] = [
  {
    id: "welcome",
    role: "assistant",
    content: [
      {
        id: "welcome-message-content",
        type: "text",
        content:
          "Hello! I'm your AI assistant. I can help you analyze documents, answer questions, and assist with your tasks. How can I help you today?",
      },
    ],
  },
];

type MessageType = {
  id: string;
  role: "assistant" | "user";
  content: string | AIChatMessage[];
  citations?: string[];
  recommendations?: string[];
};

type ConversationManagementCardContentProps = {
  notebookId: number;
  selectedSourceIds?: number[];
};

const ConversationManagementCardContent = ({
  notebookId,
  selectedSourceIds,
}: ConversationManagementCardContentProps) => {
  const [messages, setMessages] = useState<MessageType[]>(INITIAL_MESSAGES);
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Retrieve Action
  const { executeAsync: retrieve, status: retrieveStatus } = useAction(
    retrieveContextAction
  );

  // History Action
  const { executeAsync: getHistory, status: historyStatus } = useAction(
    getNotebookHistoryAction
  );

  // Send Message Action
  const { executeAsync: sendMessage, status: sendStatus } =
    useAction(sendMessageAction);

  const isLoading =
    retrieveStatus === "executing" ||
    sendStatus === "executing" ||
    historyStatus === "executing";

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text.trim()) return;

    // Validate Source Selection
    const sourceId = selectedSourceIds?.[0];
    if (!sourceId) {
      toast.error("Please select a source to chat with.");
      return;
    }

    // 1. Optimistically update UI with User Message
    const userMsgId = Date.now().toString();
    const newUserMsg: MessageType = {
      id: userMsgId,
      role: "user",
      content: message.text,
    };
    flushSync(() => {
      setMessages((prev) => [...prev, newUserMsg]);
      setText("");
    });

    try {
      // 2. Parallel Requests: History + Retrieve
      const [historyResult, retrieveResult] = await Promise.all([
        getHistory({ notebook_id: notebookId }),
        retrieve({
          user_query: message.text,
          source_id: sourceId,
        }),
      ]);

      // Check Retrieval Errors
      if (retrieveResult?.serverError || !retrieveResult?.data) {
        throw new Error("Failed to retrieve context");
      }

      const retrievedContext = retrieveResult.data;
      const historySummary = historyResult?.data || "";

      // 3. Send Message to AI
      const aiResult = await sendMessage({
        notebook_id: notebookId,
        query: message.text,
        history: historySummary,
        documents: retrievedContext,
      });

      if (aiResult?.serverError || !aiResult?.data) {
        throw new Error("Failed to get AI response");
      }

      const data = aiResult.data;

      // 4. Update UI with AI Response
      // Function to process partial paths to full URLs
      const processContent = (content: string) => {
        if (!content || !BACKEND_IP) return content;

        let processed = content;
        if (processed.includes("](http://localhost")) {
          processed = processed
            .replace(
              /\]\(http:\/\/localhost:8000\/static\//g,
              `](${BACKEND_IP}/static/`
            )
            .replace(
              /\]\(http:\/\/localhost:4000\/static\//g,
              `](${BACKEND_IP}/static/`
            )
            .replace(
              /\]\(http:\/\/192\.168\.\d+\.\d+:4000\/static\//g,
              `](${BACKEND_IP}/static/`
            );
        }
        return processed;
      };

      // Process image paths in the message parts
      const processedMessages = data.messages.map((msg) => {
        const partWithId = { ...msg, id: nanoid() };

        if (partWithId.type === "image" && partWithId.image_path) {
          let imagePath = partWithId.image_path;

          if (BACKEND_IP) {
            // Regex to check if path starts with http/https
            const isAbsolute = /^https?:\/\//i.test(imagePath);

            if (isAbsolute) {
              // Convert localhost to BACKEND_IP if needed
              if (imagePath.includes("localhost:8000")) {
                imagePath = imagePath.replace(
                  "localhost:8000",
                  new URL(BACKEND_IP).host
                );
              } else if (imagePath.includes("localhost:4000")) {
                imagePath = imagePath.replace(
                  "localhost:4000",
                  new URL(BACKEND_IP).host
                );
              }
            } else {
              // Path is relative, prepend BACKEND_IP
              // Strip leading / or static/ to ensure clean joining
              const cleanPath = imagePath.replace(/^\/?(static\/)?/, "");
              imagePath = `${BACKEND_IP}/static/${cleanPath}`;
            }
          }
          return { ...partWithId, image_path: imagePath };
        }
        if (partWithId.type === "text" && partWithId.content) {
          return { ...partWithId, content: processContent(partWithId.content) };
        }
        return partWithId;
      });

      const aiMsgId = (Date.now() + 1).toString();

      const newAiMessage: MessageType = {
        id: aiMsgId,
        role: "assistant",
        content: processedMessages,
        citations: data.citations,
        recommendations: data.recommendations,
      };

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit({ text: suggestion, files: [] });
  };

  useEffect(() => {
    if (scrollRef.current) {
      // Use timeout to allow rendering to complete
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages.length]);

  return (
    <CardContent className="flex flex-col gap-4 p-0 h-full overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            <Message from={msg.role}>
              <MessageContent>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                    <Sparkles className="size-3 text-primary" />
                    <span>AI Assistant</span>
                  </div>
                )}

                {/* Render Content based on type */}
                {Array.isArray(msg.content) ? (
                  <div className="flex flex-col gap-4 w-full">
                    {msg.content.map((part, index) => {
                      if (part.type === "text" && part.content) {
                        const isLastPart =
                          index === (msg.content as AIChatMessage[]).length - 1;
                        const showCitations =
                          isLastPart &&
                          msg.citations &&
                          msg.citations.length > 0;

                        return showCitations ? (
                          <InlineCitation key={part.id || index}>
                            <div className="transition-colors group-hover:bg-accent inline-block">
                              <MessageResponse>{part.content}</MessageResponse>
                            </div>
                            <InlineCitationCard>
                              <InlineCitationCardTrigger
                                sources={msg.citations || []}
                              />
                              <InlineCitationCardBody>
                                <InlineCitationCarousel>
                                  <InlineCitationCarouselContent>
                                    {msg.citations?.map((citation, cIndex) => (
                                      <InlineCitationCarouselItem
                                        key={citation}
                                      >
                                        <InlineCitationSource
                                          title={`Source ${cIndex + 1}`}
                                          url={citation}
                                          description="Citation details unavailable yet."
                                        />
                                      </InlineCitationCarouselItem>
                                    ))}
                                  </InlineCitationCarouselContent>
                                  <InlineCitationCarouselHeader>
                                    <InlineCitationCarouselIndex />
                                    <div className="flex items-center gap-1">
                                      <InlineCitationCarouselPrev />
                                      <InlineCitationCarouselNext />
                                    </div>
                                  </InlineCitationCarouselHeader>
                                </InlineCitationCarousel>
                              </InlineCitationCardBody>
                            </InlineCitationCard>
                          </InlineCitation>
                        ) : (
                          <MessageResponse key={part.id || index}>
                            {part.content}
                          </MessageResponse>
                        );
                      }

                      if (part.type === "image" && part.image_path) {
                        return (
                          <MessageAttachment
                            key={part.id || index}
                            data={{
                              type: "file",
                              url: part.image_path,
                              mediaType: "image/png",
                              filename: part.caption || "Image",
                            }}
                            className="w-full max-w-sm h-auto aspect-video rounded-lg border bg-muted"
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <MessageResponse>{msg.content as string}</MessageResponse>
                )}
              </MessageContent>
              {msg.role === "assistant" && (
                <MessageActions>
                  <MessageAction
                    tooltip="Copy response"
                    onClick={() => {
                      const contentToCopy = Array.isArray(msg.content)
                        ? msg.content
                            .map((c) => c.content || c.caption || "")
                            .join("\n")
                        : msg.content;
                      navigator.clipboard.writeText(contentToCopy as string);
                      toast.success("Copied to clipboard");
                    }}
                  >
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

            {/* Recommendations/Suggestions */}
            {msg.recommendations && msg.recommendations.length > 0 && (
              <Suggestions>
                {msg.recommendations.slice(0, 3).map((rec) => (
                  <Suggestion
                    key={rec}
                    suggestion={rec}
                    onClick={handleSuggestionClick}
                  />
                ))}
              </Suggestions>
            )}
          </div>
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
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit({ text, files: [] });
                }
              }}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools></PromptInputTools>
            <PromptInputSubmit
              disabled={!text.trim() && !isLoading}
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
