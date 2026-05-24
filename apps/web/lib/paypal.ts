const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export interface PayoutItem {
  publisherId: string;
  email: string;
  amountCents: number;
  currency?: string;
  period?: string;
}

export interface PayPalBatchResult {
  batchId: string;
  status: string;
  items: { senderId: string; itemId: string }[];
}

export async function createPayoutBatch(items: PayoutItem[]): Promise<PayPalBatchResult> {
  const token = await getAccessToken();
  const batchId = `ian_${Date.now()}`;

  const res = await fetch(`${PAYPAL_BASE}/v1/payments/payouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: batchId,
        email_subject: "Islamic Ad Network — Your payout is on the way",
        email_message:
          "Your earnings from Islamic Ad Network have been sent to your PayPal account. JazakAllah khair for being part of our publisher network.",
      },
      items: items.map((item) => ({
        recipient_type: "EMAIL",
        amount: {
          value: (item.amountCents / 100).toFixed(2),
          currency: item.currency ?? "USD",
        },
        note: item.period ? `Islamic Ad Network earnings — ${item.period}` : "Islamic Ad Network earnings",
        sender_item_id: item.publisherId,
        receiver: item.email,
      })),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal payout failed: ${text}`);
  }

  const data = await res.json();
  const batch = data.batch_header ?? {};

  return {
    batchId: batch.payout_batch_id ?? batchId,
    status: batch.batch_status ?? "PENDING",
    items: (data.items ?? []).map((it: { sender_item_id: string; payout_item_id: string }) => ({
      senderId: it.sender_item_id,
      itemId: it.payout_item_id,
    })),
  };
}

export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
    cache: "no-store",
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}
