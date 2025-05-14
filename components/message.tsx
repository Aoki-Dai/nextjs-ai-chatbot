'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import { DocumentToolCall, DocumentToolResult } from './document';
import { PencilEditIcon, SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn, sanitizeText } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import type { UseChatHelpers } from '@ai-sdk/react';
import { SuggestButtons } from './suggest-buttons';
import { generateSuggestions } from '@/lib/suggestions';

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  requiresScrollPadding,
  append,
  messages,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
  append: UseChatHelpers['append'];
  messages: Array<UIMessage>;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const showSuggestions = message.role === 'assistant' && !isLoading && !isReadonly;
  const suggestions = showSuggestions ? generateSuggestions(message) : [];

  const handleSuggestionClick = (suggestion: string) => {
    append({
      role: 'user',
      content: suggestion,
    });
  };

  // メッセージの内容に基づいて絵文字を選択する関数
  const getEmojiCharacter = (content: string, role: string) => {
    // ユーザーのメッセージの場合、次のアシスタントのメッセージで使用する絵文字を決定
    if (role === 'user') {
      if (content.includes('?') || content.includes('？')) {
        return '🤔'; // 質問に対して共感
      }
      if (content.includes('!') || content.includes('！')) {
        return '😊'; // 感嘆に対して共感
      }
      if (content.includes('すみません') || content.includes('申し訳')) {
        return '🙇‍♂️'; // 謝罪に対して共感
      }
      if (content.includes('ありがとう') || content.includes('感謝')) {
        return '🙏'; // 感謝に対して共感
      }
      if (content.includes('笑') || content.includes('楽しい') || content.includes('面白い')) {
        return '😄'; // 喜びに共感
      }
      if (content.includes('悲しい') || content.includes('残念')) {
        return '😢'; // 悲しみに共感
      }
      if (content.includes('怒') || content.includes('不満')) {
        return '😠'; // 怒りに共感
      }
      if (content.includes('驚') || content.includes('びっくり')) {
        return '😲'; // 驚きに共感
      }
      if (content.includes('頑張') || content.includes('応援')) {
        return '💪'; // 応援に共感
      }
      if (content.includes('考え') || content.includes('検討')) {
        return '💭'; // 思考に共感
      }
      if (content.includes('成功') || content.includes('できた')) {
        return '🎉'; // 成功を祝福
      }
      if (content.includes('疲') || content.includes('大変')) {
        return '😌'; // 疲れに共感
      }
      if (content.includes('心配') || content.includes('不安')) {
        return '🤗'; // 心配に寄り添う
      }
      if (content.includes('嬉') || content.includes('幸せ')) {
        return '🥰'; // 幸せを共有
      }
      if (content.includes('眠') || content.includes('寝')) {
        return '😴'; // 眠気に共感
      }
      return '😊'; // デフォルトを親しみやすい笑顔に変更
    }
    
    // アシスタントのメッセージの場合
    if (role === 'assistant') {
      if (content.includes('申し訳ありません') || content.includes('すみません')) {
        return '🙇‍♂️'; // 謝罪
      }
      if (content.includes('お役に立てて嬉しい') || content.includes('喜んで')) {
        return '🥰'; // 喜び
      }
      if (content.includes('残念') || content.includes('申し訳')) {
        return '😔'; // 残念
      }
      if (content.includes('素晴らしい') || content.includes('素敵')) {
        return '✨'; // 称賛
      }
      if (content.includes('注意') || content.includes('気をつけて')) {
        return '⚠️'; // 注意
      }
      if (content.includes('おめでとう') || content.includes('祝福')) {
        return '🎊'; // 祝福
      }
      if (content.includes('頑張りましょう') || content.includes('一緒に')) {
        return '💪'; // 励まし
      }
      if (content.includes('考えましょう') || content.includes('検討')) {
        return '💭'; // 思考
      }
      if (content.includes('確かに') || content.includes('その通り')) {
        return '👍'; // 同意
      }
      if (content.includes('なるほど') || content.includes('理解')) {
        return '🤔'; // 理解
      }
      if (content.includes('驚き') || content.includes('びっくり')) {
        return '😲'; // 驚き
      }
      if (content.includes('心配') || content.includes('不安')) {
        return '🤗'; // 心配
      }
      if (content.includes('疲れ') || content.includes('大変')) {
        return '😌'; // 共感
      }
      return '😊'; // デフォルトを親しみやすい笑顔に変更
    }
    
    return '😊'; // その他の場合も親しみやすい笑顔に変更
  };

  // 前のユーザーメッセージを取得する関数
  const getPreviousUserMessage = (messages: UIMessage[] | undefined, currentMessage: UIMessage) => {
    if (!messages) return '';
    
    const currentIndex = messages.findIndex(m => m.id === currentMessage.id);
    if (currentIndex === -1) return '';

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return messages[i].content;
      }
    }
    return '';
  };

  // アシスタントのメッセージ内容を取得する関数
  const getAssistantMessageContent = (message: UIMessage) => {
    if (message.parts) {
      const textPart = message.parts.find(part => part.type === 'text');
      if (textPart && 'text' in textPart) {
        return textPart.text;
      }
    }
    return '';
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full max-w-3xl px-4 mx-auto group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <motion.div 
              className="flex items-center justify-center rounded-full size-10 ring-1 shrink-0 ring-border bg-background"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
            >
              <motion.div 
                className="translate-y-px text-2xl"
                animate={{ 
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {getEmojiCharacter(
                  message.role === 'assistant' 
                    ? getAssistantMessageContent(message)
                    : getPreviousUserMessage(messages, message),
                  message.role
                )}
              </motion.div>
            </motion.div>
          )}

          <div
            className={cn('flex flex-col gap-4 w-full', {
              'min-h-96': message.role === 'assistant' && requiresScrollPadding,
            })}
          >
            {message.experimental_attachments &&
              message.experimental_attachments.length > 0 && (
                <div
                  data-testid={`message-attachments`}
                  className="flex flex-row justify-end gap-2"
                >
                  {message.experimental_attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                    />
                  ))}
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row items-start gap-2">
                      {message.role === 'user' && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 rounded-full opacity-0 h-fit text-muted-foreground group-hover/message:opacity-100"
                              onClick={() => {
                                setMode('edit');
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                            message.role === 'user',
                        })}
                      >
                        <Markdown>{sanitizeText(part.text)}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row items-start gap-2">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              if (type === 'tool-invocation') {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'call') {
                  const { args } = toolInvocation;

                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ['getWeather'].includes(toolName),
                      })}
                    >
                      {toolName === 'getWeather' ? (
                        <Weather />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview isReadonly={isReadonly} args={args} />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolCall
                          type="update"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : null}
                    </div>
                  );
                }

                if (state === 'result') {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview
                          isReadonly={isReadonly}
                          result={result}
                        />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolResult
                          type="update"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolResult
                          type="request-suggestions"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
              }
            })}

            {showSuggestions && (
              <SuggestButtons
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            )}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full max-w-3xl px-4 mx-auto group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="flex items-center justify-center rounded-full size-8 ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
