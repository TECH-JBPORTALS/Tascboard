"use client";

import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import type { EditorThemeClasses } from "lexical";
import type React from "react";
import { cn } from "@/lib/utils";

const theme: EditorThemeClasses = {
  // Theme styling goes here
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

export function TextEditor({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const config: InitialConfigType = {
    namespace: "TextEditor",
    onError,
    theme,
    nodes: [],
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div
        className={cn(`relative mx-auto flex w-full flex-col`, className)}
        {...props}
      >
        <div className="relative">
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
      </div>
    </LexicalComposer>
  );
}
