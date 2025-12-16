// hooks/useAutoSync.ts
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudCheck, CloudFog, CloudHail } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type AutoSyncStatus = "synced" | "unsaved" | "saving";

interface UseAutoSyncProps<
  T,
  R = Awaited<ReturnType<(values: T) => Promise<unknown>>>,
> {
  values: T;
  isDirty: boolean;
  onSave: (values: T) => Promise<R>;
  options?: {
    /** Debounce delay interval for saving changes after form is dirty */
    debounceDelay?: number;
    onSuccess?: () => void;
    onError?: (err: unknown) => void;
  };
}

/**
 * Auto-sync hook with an internal debounce timer (reliable).
 *
 * - `values` can be any serializable object (we JSON.stringify to compare).
 * - `isDirty` should reflect whether user made changes (from react-hook-form).
 * - `onSave` should be a stable function (useCallback in parent).
 */
export function useAutoSync<T>({
  options,
  values,
  isDirty,
  onSave,
}: UseAutoSyncProps<T>) {
  const { debounceDelay = 2000, onSuccess, onError } = options ?? {};

  const [status, setStatus] = useState<AutoSyncStatus>("synced");

  // last saved serialized snapshot to avoid redundant saves
  const lastSaved = useRef<string | null>(null);

  // pending debounce timer
  const timerRef = useRef<number | null>(null);

  // cancel flag for in-flight save
  const inFlightRef = useRef<boolean>(false);

  const serialize = useCallback((v: T) => {
    try {
      return JSON.stringify(v);
    } catch {
      // fallback: convert to string if non-serializable (shouldn't usually happen)
      return String(v as unknown);
    }
  }, []);

  // stable save wrapper
  const doSave = useCallback(
    async (vals: T) => {
      if (inFlightRef.current) return; // avoid overlapping saves
      inFlightRef.current = true;
      setStatus("saving");
      try {
        await onSave(vals);
        lastSaved.current = serialize(vals);
        setStatus("synced");
        onSuccess?.();
      } catch (err) {
        console.error("AUTO SYNC ERROR:", err);
        setStatus("synced");
        onError?.(err);
      } finally {
        inFlightRef.current = false;
      }
    },
    [onSave, onSuccess, onError, serialize],
  );

  // immediate transition to "unsaved" when user edits
  useEffect(() => {
    if (isDirty && status === "synced") setStatus("unsaved");
  }, [isDirty, status]);

  // watch "values" changes and debounce the save
  useEffect(() => {
    // clear any previous timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // only consider saving if dirty
    if (!isDirty) return;

    const serialized = serialize(values);

    // If serialized equals lastSaved, don't schedule a save (no changes)
    if (serialized === lastSaved.current) {
      // If there was a "unsaved" flag but values equal lastSaved, mark synced
      if (status !== "synced") {
        setStatus("synced");
      }
      return;
    }

    // schedule a debounced save
    timerRef.current = window.setTimeout(() => {
      // double-check before saving
      const currentSerialized = serialize(values);
      if (currentSerialized !== lastSaved.current) {
        void doSave(values);
      } else {
        // nothing to save
        setStatus("synced");
      }
      timerRef.current = null;
    }, debounceDelay);

    // cleanup
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // Intentionally include only necessary deps (values is ok here —
    // we want the effect to run when values change)
  }, [values, isDirty, debounceDelay, doSave, serialize, status]);

  // cleanup on unmount: clear timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return status;
}

type AutoSyncButtonProps<T> = UseAutoSyncProps<T>;

export function AutoSyncButton<T extends object>(
  props: AutoSyncButtonProps<T>,
) {
  const status = useAutoSync(props);

  return (
    <Button
      size={"xs"}
      variant={"ghost"}
      type="button"
      className={cn(
        "w-fit rounded-full capitalize",
        status === "saving" && "text-amber-600",
        status === "unsaved" && "bg-accent",
        status == "synced" && "text-green-600",
      )}
    >
      {status == "saving" && (
        <>
          <CloudHail /> Saving...
        </>
      )}
      {status == "synced" && (
        <>
          <CloudCheck /> Synced
        </>
      )}
      {status == "unsaved" && (
        <>
          <CloudFog /> Unsaved
        </>
      )}
    </Button>
  );
}
