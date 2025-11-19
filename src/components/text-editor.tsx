"use client";

import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin.js";
import React from "react";
import { cn } from "@/lib/utils";
import { type EditorThemeClasses, type LexicalEditor } from "lexical";
import {
  TRANSFORMERS,
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useRef } from "react";

const theme: EditorThemeClasses = {
  // Theme styling goes here
  heading: {
    h1: "text-3xl font-extrabold",
    h2: "text-2xl font-bold",
    h3: "text-xl font-semibold",
  },
  link: "text-blue-500 hover:text-underline hover:cursor-pointer",
  hashtag: "text-muted-foreground",
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

interface TextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  onChange?: (markdown: string) => void;
  markdown?: string;
}

export function TextEditor({
  className,
  markdown = "",
  onChange,
  ...props
}: TextEditorProps) {
  const config: InitialConfigType = {
    namespace: "TextEditor",
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
    editorState: () =>
      $convertFromMarkdownString(markdown, TRANSFORMERS, undefined, true, true),
    editable: true,
    theme,
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div
        className={cn(`relative mx-auto flex w-full flex-col`, className)}
        {...props}
      >
        <div className="relative" suppressHydrationWarning>
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="relative w-full overflow-auto focus:outline-none" />
            }
            placeholder={
              <p className="text-muted-foreground pointer-events-none absolute top-0 w-full">
                Add description...
              </p>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin
          onChange={(_, editor) => {
            editor.update(() => {
              const markdown = $convertToMarkdownString(
                TRANSFORMERS,
                undefined,
                true,
              );
              onChange?.(markdown);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}
