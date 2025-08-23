import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function BlipMessage({
  message,
}: {
  message: {
    user: { fullName: string; imageUrl: string };
    createdAt: string;
    content: string;
  };
}) {
  return (
    <div className="flex gap-2">
      <Avatar className="border">
        <AvatarImage src={message.user.imageUrl} />
        <AvatarFallback>{message.user.fullName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1 text-sm">
        <div className="space-x-2">
          <span className="font-semibold">{message.user.fullName}</span>
          <time className="text-muted-foreground text-xs">
            {message.createdAt}
          </time>
        </div>
        <p>{message.content}</p>
      </div>
    </div>
  );
}
