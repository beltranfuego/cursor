"use server";

import { revalidatePath } from "next/cache";

import {
  type BuySide,
  isValidBuySide,
  parseDollarsToCents,
} from "@/lib/fake-money";
import type { BuyActionResult } from "@/lib/markets/buy-types";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type BuyRpcResult = {
  ok: boolean;
  error?: string;
  balance_cents?: number;
  yes_shares_cents?: number;
  no_shares_cents?: number;
};

export async function buyMarketShares(
  marketId: string,
  side: BuySide,
  amountDollars: string,
): Promise<BuyActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, error: "Sign in to buy shares with fake money." };
  }

  if (!isValidBuySide(side)) {
    return { ok: false, error: "Choose Yes or No." };
  }

  const amountCents = parseDollarsToCents(amountDollars);

  if (amountCents === null) {
    return {
      ok: false,
      error: "Enter a valid fake dollar amount with up to two decimal places.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("buy_market_shares", {
    p_market_id: marketId,
    p_side: side,
    p_amount_cents: amountCents,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const result = data as BuyRpcResult | null;

  if (!result?.ok) {
    return {
      ok: false,
      error: result?.error ?? "Could not complete this fake-money purchase.",
    };
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/positions");
  revalidatePath("/");

  return {
    ok: true,
    balanceCents: result.balance_cents ?? 0,
    yesSharesCents: result.yes_shares_cents ?? 0,
    noSharesCents: result.no_shares_cents ?? 0,
  };
}
