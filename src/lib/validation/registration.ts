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
  const trimmed = value.trim();
  if (!trimmed) return `${label} is required.`;
  const normalized = trimmed.replace(/\s/g, "");

  if (normalized.startsWith("07")) {
    if (!/^07\d{8}$/.test(normalized)) {
      return "Enter 10 digits starting with 07 (e.g. 07X XXX XXXX).";
    }
    return null;
  }

  if (normalized.startsWith("+94")) {
    if (!/^\+947\d{8}$/.test(normalized)) {
      return "Use +94 7X XXX XXXX (9 digits after +94, starting with 7).";
    }
    return null;
  }

  return "Must start with 07 or +94 7.";
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
