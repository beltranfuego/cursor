import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { EmailConfirmationNotice } from "@/components/marketlab/auth-form";
import { HeaderNav } from "@/components/marketlab/header-nav";

const sampleProfile = {
  id: "user-1",
  balance_cents: 100000,
  first_name: "Ada",
  last_name: "Lovelace",
  created_at: "2026-06-01T12:00:00.000Z",
  updated_at: "2026-06-01T12:00:00.000Z",
};

describe("HeaderNav", () => {
  it("renders signed-out actions and markets link", () => {
    const html = renderToStaticMarkup(<HeaderNav user={null} profile={null} />);

    expect(html).toContain("Markets");
    expect(html).toContain("My Positions");
    expect(html).toContain("/positions");
    expect(html).toContain("Sign in");
    expect(html).toContain("Sign up");
    expect(html).toContain("/login?mode=sign-in");
    expect(html).toContain("/login?mode=sign-up");
    expect(html).not.toContain("Sign out");
    expect(html).not.toContain("fake");
    expect(html).toMatch(/toggle theme|switch to/i);
  });

  it("renders signed-in balance and sign out", () => {
    const html = renderToStaticMarkup(
      <HeaderNav user={{ email: "ada@example.com" }} profile={sampleProfile} />,
    );

    expect(html).toContain("$1,000.00 fake");
    expect(html).toContain("Sign out");
    expect(html).toContain("Ada Lovelace");
    expect(html).not.toContain("Sign in");
    expect(html).not.toContain("Sign up");
    expect(html).toMatch(/toggle theme|switch to/i);
  });

  it("renders missing profile state without balance editing", () => {
    const html = renderToStaticMarkup(
      <HeaderNav user={{ email: "ada@example.com" }} profile={null} />,
    );

    expect(html).toContain("Balance unavailable");
    expect(html).toContain("Sign out");
    expect(html).not.toContain('type="number"');
    expect(html).not.toContain('type="text"');
    expect(html).not.toContain("Sign in");
    expect(html).not.toContain("Sign up");
  });
});

describe("EmailConfirmationNotice", () => {
  it("shows check your email guidance", () => {
    const html = renderToStaticMarkup(
      <EmailConfirmationNotice email="ada@example.com" />,
    );

    expect(html).toContain("Check your email");
    expect(html).toContain("ada@example.com");
  });
});
