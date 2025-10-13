"use client";

import { Card } from "@workspace/ui/components/card";
import { AlertTriangle, X } from "lucide-react";

interface WebhookStatusProps {
  readonly onDismiss: () => void;
}

export const WebhookStatus = ({ onDismiss }: WebhookStatusProps) => {
  return (
    <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 max-w-lg">
      <div className="flex gap-3 p-4">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
        <div className="flex-1">
          <p className="mb-2 text-xs text-yellow-600/90">
            In development mode, you need to run the Stripe webhook listener for
            subscriptions to update:
          </p>
          <pre className="rounded bg-yellow-100 p-2 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            stripe listen --forward-to localhost:3002/webhooks/stripe
          </pre>
        </div>
        <button
          onClick={onDismiss}
          className="self-start text-yellow-600 hover:text-slate-500 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </Card>
  );
};
