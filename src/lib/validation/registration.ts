import { nationalPhoneRules, parseE164 } from "@/lib/countries";

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required.";
  if (!trimmed.includes("@")) return "Include an @ symbol in your email.";
  if (!/\.[a-z]{2,}$/i.test(trimmed)) {
    return "Include a domain extension (e.g. .com, .lk).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address (e.g. name@example.com).";
  }
  return null;
}

export function validateMobile(value: string, label = "Mobile number"): string | null {
  const trimmed = value.trim().replace(/\s/g, "");
  if (!trimmed) return `${label} is required.`;

  // Legacy local format still accepted if pasted
  if (trimmed.startsWith("07") && !trimmed.startsWith("+")) {
    if (!/^07\d{8}$/.test(trimmed)) {
      return "Enter 10 digits starting with 07 (e.g. 07X XXX XXXX).";
    }
    return null;
  }

  const parsed = parseE164(trimmed);
  if (!parsed) {
    return `Enter a valid ${label.toLowerCase()} with country code.`;
  }

  const { country, national } = parsed;
  const rules = nationalPhoneRules(country.iso);

  if (country.iso === "LK") {
    if (!rules.pattern?.test(national)) {
      return `${label}: enter ${rules.hint} after +94.`;
    }
    return null;
  }

  if (!/^\d{6,15}$/.test(national)) {
    return `${label}: enter ${rules.hint} after +${country.dial}.`;
  }
  return null;
}

export function validateResidence(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/\s/g, "");
  if (!normalized.startsWith("011")) {
    return "Must start with 011 (e.g. 011 XXXXXXX).";
  }
  if (!/^011\d{7}$/.test(normalized)) {
    return "Enter 011 followed by 7 digits (e.g. 011 XXXXXXX).";
  }
  return null;
}

/**
 * New Sri Lankan NIC (12 digits): first 4 digits are birth year (19xx/20xx).
 * Old format (9 digits + V/X, e.g. 901234567V) is ignored.
 */
export function extractNicBirthYear(nic: string): number | null {
  const digits = nic.trim().replace(/\D/g, "");
  // New format starts with century year; old format starts with 2-digit YY (e.g. 90…)
  if (!/^(19|20)\d{2}/.test(digits)) return null;
  if (digits.length < 4 || digits.length > 12) return null;

  const year = parseInt(digits.slice(0, 4), 10);
  const maxYear = new Date().getFullYear();
  if (year < 1920 || year > maxYear) return null;
  return year;
}
