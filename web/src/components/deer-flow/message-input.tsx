"use client";

import * as React from "react";

export type MessageInputRef = {
  focus: () => void;
  clear: () => void;
  value: () => string;
};

type Props = {
  placeholder?: string;
  disabled?: boolean;
  onSend?: (value: string) => void;
  className?: string;
  sendLabel?: React.ReactNode;
};

const MessageInput = React.forwardRef<MessageInputRef, Props>(
  (
    {
      placeholder = "Type your message...",
      disabled = false,
      onSend,
      className = "",
      sendLabel = "Send",
    },
    ref
  ) => {
    const [text, setText] = React.useState("");
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    const doSend = React.useCallback(() => {
      const v = text.trim();
      if (!v) return;
      onSend?.(v);
      setText("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }, [text, onSend]);

    React.useImperativeHandle(
      ref,
      (): MessageInputRef => ({
        focus: () => inputRef.current?.focus(),
        clear: () => setText(""),
        value: () => text,
      }),
      [text]
    );

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        doSend();
      }
    };

    return (
      <div className={`w-full flex items-end gap-2 ${className}`}>
        <textarea
          ref={inputRef}
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          className="
            flex-1 resize-none rounded-md border px-3 py-2 text-sm
            shadow-sm focus:outline-none focus:ring-2 focus:ring-ring
            disabled:opacity-50
          "
        />
        <button
          type="button"
          disabled={disabled || !text.trim()}
          onClick={doSend}
          className="
            rounded-md border px-3 py-2 text-sm font-medium
            hover:bg-accent disabled:opacity-50
          "
        >
          {sendLabel}
        </button>
      </div>
    );
  }
);

MessageInput.displayName = "MessageInput";

export default MessageInput;
