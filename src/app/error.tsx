"use client";
import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="space-y-4 text-center">
          <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Something went wrong!
          </CardTitle>
          <p className="text-muted-foreground">
            We encountered an error while loading the data. This might be a
            temporary issue or a problem with your permissions.
          </p>
          {error.digest && (
            <p className="text-muted-foreground font-mono text-xs">
              Error ID: {error.digest}
            </p>
          )}
        </CardHeader>
        <CardFooter>
          <Button
            onClick={reset}
            variant={"outline"}
            size="lg"
            className="w-full"
          >
            <RotateCcw />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
