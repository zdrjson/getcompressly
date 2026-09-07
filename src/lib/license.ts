// Lemon Squeezy license validation — fully client-side, calls LS public API.
// Free tier limits are enforced here too.

const STORAGE_KEY = 'compressly.license.v1';
const LS_API = 'https://api.lemonsqueezy.com/v1/licenses';

export interface LicenseState {
  key: string;
  email?: string;
  productName?: string;
  validatedAt: number;
}

export const FREE_LIMITS = {
  maxBatch: 20,
  maxFileSizeMB: 25,
  allowedFormats: new Set(['jpeg', 'png', 'webp', 'avif']),
  allowLossless: false,
  allowExifPreserve: false,
};

export const PRO_LIMITS = {
  maxBatch: Infinity,
  maxFileSizeMB: 200,
  allowedFormats: new Set(['jpeg', 'png', 'webp', 'avif', 'jxl']),
  allowLossless: true,
  allowExifPreserve: true,
};

export function loadLicense(): LicenseState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LicenseState;
  } catch {
    return null;
  }
}

export function clearLicense() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function activateLicense(licenseKey: string, instanceName = 'compressly-web'): Promise<LicenseState> {
  const body = new URLSearchParams({ license_key: licenseKey, instance_name: instanceName });
  const res = await fetch(`${LS_API}/activate`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`Activation failed (HTTP ${res.status})`);
  const data = await res.json();
  if (!data?.activated) {
    throw new Error(data?.error ?? 'License key was rejected by Lemon Squeezy');
  }
  const state: LicenseState = {
    key: licenseKey,
    email: data?.meta?.customer_email,
    productName: data?.meta?.product_name,
    validatedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function limits(license: LicenseState | null) {
  return license ? PRO_LIMITS : FREE_LIMITS;
}
