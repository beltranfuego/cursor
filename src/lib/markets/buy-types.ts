import type { BuySide } from "@/lib/fake-money";

export type BuyActionResult =
  | {
      ok: true;
      balanceCents: number;
      yesSharesCents: number;
      noSharesCents: number;
    }
  | {
      ok: false;
      error: string;
    };

export type MarketBuyFormProps = {
  marketId: string;
  isSignedIn: boolean;
  isBuyable: boolean;
  balanceCents: number;
  yesSharesCents: number;
  noSharesCents: number;
  buyAction: (
    marketId: string,
    side: BuySide,
    amountDollars: string,
  ) => Promise<BuyActionResult>;
};
