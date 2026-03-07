const STORAGE_KEY = "luxcard-merchant-auth";
const MOCK_DELAY_MS = 600;

export interface MerchantUser {
  id: string;
  email: string;
  companyName: string;
}

export interface MerchantSession {
  user: MerchantUser;
  token: string;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getStored(): MerchantSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MerchantSession;
  } catch {
    return null;
  }
}

export function getMerchantSession(): MerchantSession | null {
  return getStored();
}

export function merchantLogout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Mock: email + password. Accepts demo@luxcard.mn / demo123 for testing. */
export async function merchantLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: MerchantSession }> {
  await delay(MOCK_DELAY_MS);
  const normalizedEmail = email.trim().toLowerCase();
  const valid =
    normalizedEmail === "demo@luxcard.mn" && password === "demo123";
  if (!valid) {
    return {
      success: false,
      error: "Имэйл эсвэл нууц үг буруу байна. Туршиж үзэх: demo@luxcard.mn / demo123",
    };
  }
  const session: MerchantSession = {
    user: {
      id: "merchant-1",
      email: normalizedEmail,
      companyName: "Rosewood Restaurant",
    },
    token: `mtk-${Math.random().toString(36).slice(2)}`,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return { success: true, session };
}
