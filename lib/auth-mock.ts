const STORAGE_KEY = "luxcard-auth";
const MOCK_DELAY_MS = 800;

export interface AuthUser {
  id: string;
  phone: string;
  email?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getStored(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function getSession(): AuthSession | null {
  return getStored();
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function sendVerificationCode(phone: string): Promise<{ success: boolean; error?: string }> {
  await delay(MOCK_DELAY_MS);
  const normalized = phone.replace(/\D/g, "");
  if (normalized.length < 8) return { success: false, error: "Invalid phone number." };
  return { success: true };
}

export async function verifyCode(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  await delay(MOCK_DELAY_MS);
  if (code.length < 4) return { success: false, error: "Code must be at least 4 digits." };
  return { success: true };
}

/** Sign in with phone + OTP code (password optional for OTP-only flow). */
export async function login(
  phone: string,
  _password: string,
  code: string
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  await delay(MOCK_DELAY_MS);
  const verify = await verifyCode(phone, code);
  if (!verify.success) return { success: false, error: verify.error };
  const session: AuthSession = {
    user: { id: `u-${Date.now()}`, phone: phone.replace(/\D/g, "") },
    token: `tk-${Math.random().toString(36).slice(2)}`,
  };
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return { success: true, session };
}

export async function register(
  phone: string,
  code: string,
  email?: string,
  password?: string
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  await delay(MOCK_DELAY_MS);
  const verify = await verifyCode(phone, code);
  if (!verify.success) return { success: false, error: verify.error };
  const session: AuthSession = {
    user: {
      id: `u-${Date.now()}`,
      phone: phone.replace(/\D/g, ""),
      email: email?.trim() || undefined,
    },
    token: `tk-${Math.random().toString(36).slice(2)}`,
  };
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return { success: true, session };
}
