"use client";

import * as React from "react";
import { CheckCircle2, Loader2, Play, Send, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AdapterStatus = "idle" | "submitting" | "success" | "error";

export type PowerAppsSubmitResult = {
  id: string;
  message: string;
};

export type PowerAppsAdapter = {
  name: string;
  submit: (values: Record<string, string>) => Promise<PowerAppsSubmitResult>;
};

export type PowerAppsVisualProps = {
  adapter?: PowerAppsAdapter;
  /** Enables the explicit local mock used by the documentation gallery. */
  mock?: boolean;
  value?: Record<string, string>;
  defaultValue?: Record<string, string>;
  onValueChange?: (values: Record<string, string>) => void;
  onSubmitted?: (result: PowerAppsSubmitResult) => void;
  className?: string;
};

export type PowerAutomateRunResult = {
  runId: string;
  status: "queued" | "succeeded";
  message: string;
};

export type PowerAutomateAdapter = {
  name: string;
  trigger: (flowId: string, payload: Record<string, string>) => Promise<PowerAutomateRunResult>;
};

export type PowerAutomateVisualProps = {
  flowId: string;
  adapter?: PowerAutomateAdapter;
  /** Enables the explicit local mock used by the documentation gallery. */
  mock?: boolean;
  defaultPayload?: Record<string, string>;
  onRunComplete?: (result: PowerAutomateRunResult) => void;
  className?: string;
};

function fieldLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function AdapterMissing({ product }: { product: string }) {
  return (
    <div
      className="rounded-[var(--radius)] border border-dashed border-[var(--warning)]/40 bg-[var(--warning-soft)] p-3.5"
      role="status"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <TriangleAlert className="h-4 w-4 shrink-0 text-[var(--warning)]" aria-hidden />
        Adapter required
      </div>
      <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
        Supply an authorized {product} adapter. No provider SDK, credentials, iframe, or remote
        action is bundled.
      </p>
    </div>
  );
}

function StatusBanner({
  status,
  message,
}: {
  status: AdapterStatus;
  message: string;
}) {
  const isError = status === "error";
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-[var(--radius)] px-3 py-2.5 text-[13px] leading-snug",
        isError
          ? "bg-[var(--destructive-soft)] text-destructive"
          : "bg-[var(--success-soft)] text-[var(--success)]",
      )}
      role={isError ? "alert" : "status"}
    >
      {isError ? (
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      )}
      <span className="text-foreground">{message}</span>
    </div>
  );
}

const mockPowerAppsAdapter: PowerAppsAdapter = {
  name: "Local write-back mock",
  async submit(values) {
    return {
      id: `mock-${Object.keys(values).sort().join("-") || "submission"}`,
      message: "Mock write-back accepted locally. No external application was contacted.",
    };
  },
};

const mockPowerAutomateAdapter: PowerAutomateAdapter = {
  name: "Local flow mock",
  async trigger(flowId, payload) {
    return {
      runId: `mock-${flowId}-${Object.keys(payload).length}`,
      status: "succeeded",
      message: "Mock flow completed locally. No external automation was triggered.",
    };
  },
};

export function PowerAppsVisual({
  adapter,
  mock = false,
  value,
  defaultValue = { project: "North expansion", owner: "Alex", forecast: "125000" },
  onValueChange,
  onSubmitted,
  className,
}: PowerAppsVisualProps) {
  const activeAdapter = adapter ?? (mock ? mockPowerAppsAdapter : undefined);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [status, setStatus] = React.useState<AdapterStatus>("idle");
  const [message, setMessage] = React.useState("");
  const current = value ?? internalValue;
  const formId = React.useId();

  const update = (key: string, nextValue: string) => {
    const next = { ...current, [key]: nextValue };
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    setStatus("idle");
    setMessage("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeAdapter) return;
    setStatus("submitting");
    try {
      const result = await activeAdapter.submit(current);
      setStatus("success");
      setMessage(result.message);
      onSubmitted?.(result);
    } catch (reason) {
      setStatus("error");
      setMessage(reason instanceof Error ? reason.message : String(reason));
    }
  };

  return (
    <Card className={cn("max-w-[440px]", className)}>
      <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <CardTitle>Application write-back</CardTitle>
          <CardDescription>
            Independent integration surface — not affiliated with Microsoft Power Apps.
          </CardDescription>
        </div>
        {mock ? (
          <Badge variant="secondary" className="shrink-0">
            Mock
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {!activeAdapter ? (
          <AdapterMissing product="Power Apps" />
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(current).map(([key, fieldValue]) => {
                const id = `${formId}-${key}`;
                return (
                  <label key={key} className="block space-y-1.5" htmlFor={id}>
                    <span className="block text-[13px] font-medium text-muted-foreground">
                      {fieldLabel(key)}
                    </span>
                    <Input
                      id={id}
                      value={fieldValue}
                      onChange={(event) => update(key, event.target.value)}
                      disabled={status === "submitting"}
                      autoComplete="off"
                    />
                  </label>
                );
              })}
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button type="submit" disabled={status === "submitting"} className="shrink-0">
                {status === "submitting" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                {status === "submitting" ? "Submitting…" : "Submit write-back"}
              </Button>
              <span className="text-[13px] text-muted-foreground">{activeAdapter.name}</span>
            </div>
          </form>
        )}
        {message ? <StatusBanner status={status} message={message} /> : null}
      </CardContent>
    </Card>
  );
}

export function PowerAutomateVisual({
  flowId,
  adapter,
  mock = false,
  defaultPayload = { report: "Operations", period: "Q3" },
  onRunComplete,
  className,
}: PowerAutomateVisualProps) {
  const activeAdapter = adapter ?? (mock ? mockPowerAutomateAdapter : undefined);
  const [status, setStatus] = React.useState<AdapterStatus>("idle");
  const [result, setResult] = React.useState<PowerAutomateRunResult | null>(null);

  const run = async () => {
    if (!activeAdapter || !flowId.trim()) return;
    setStatus("submitting");
    setResult(null);
    try {
      const next = await activeAdapter.trigger(flowId, defaultPayload);
      setResult(next);
      setStatus("success");
      onRunComplete?.(next);
    } catch (reason) {
      setStatus("error");
      setResult({
        runId: "",
        status: "queued",
        message: reason instanceof Error ? reason.message : String(reason),
      });
    }
  };

  return (
    <Card className={cn("max-w-[440px]", className)}>
      <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <CardTitle>Automation trigger</CardTitle>
          <CardDescription>
            Independent integration surface — not affiliated with Microsoft Power Automate.
          </CardDescription>
        </div>
        {mock ? (
          <Badge variant="secondary" className="shrink-0">
            Mock
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {!activeAdapter ? (
          <AdapterMissing product="Power Automate" />
        ) : (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Button
              type="button"
              onClick={run}
              disabled={status === "submitting" || !flowId.trim()}
              className="shrink-0"
            >
              {status === "submitting" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Play className="h-4 w-4" aria-hidden />
              )}
              {status === "submitting" ? "Triggering…" : `Trigger ${flowId}`}
            </Button>
            <span className="text-[13px] text-muted-foreground">{activeAdapter.name}</span>
          </div>
        )}
        {result ? (
          <div
            className={cn(
              "rounded-[var(--radius)] px-3 py-2.5 text-[13px] leading-snug",
              status === "error"
                ? "bg-[var(--destructive-soft)]"
                : "bg-muted/70",
            )}
            role={status === "error" ? "alert" : "status"}
          >
            <div className="font-medium text-foreground">{result.message}</div>
            {result.runId ? (
              <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                Run {result.runId}
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
