export type Country = {
  iso: string;
  name: string;
  dial: string;
  flag: string;
};

/** Common dial codes for the phone picker. Sri Lanka is default in the UI. */
export const COUNTRIES: Country[] = [
  { iso: "LK", name: "Sri Lanka", dial: "94", flag: "🇱🇰" },
  { iso: "IN", name: "India", dial: "91", flag: "🇮🇳" },
  { iso: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { iso: "US", name: "United States", dial: "1", flag: "🇺🇸" },
  { iso: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
  { iso: "AU", name: "Australia", dial: "61", flag: "🇦🇺" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", flag: "🇦🇪" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", flag: "🇸🇦" },
  { iso: "QA", name: "Qatar", dial: "974", flag: "🇶🇦" },
  { iso: "OM", name: "Oman", dial: "968", flag: "🇴🇲" },
  { iso: "KW", name: "Kuwait", dial: "965", flag: "🇰🇼" },
  { iso: "BH", name: "Bahrain", dial: "973", flag: "🇧🇭" },
  { iso: "SG", name: "Singapore", dial: "65", flag: "🇸🇬" },
  { iso: "MY", name: "Malaysia", dial: "60", flag: "🇲🇾" },
  { iso: "MV", name: "Maldives", dial: "960", flag: "🇲🇻" },
  { iso: "PK", name: "Pakistan", dial: "92", flag: "🇵🇰" },
  { iso: "BD", name: "Bangladesh", dial: "880", flag: "🇧🇩" },
  { iso: "NP", name: "Nepal", dial: "977", flag: "🇳🇵" },
  { iso: "DE", name: "Germany", dial: "49", flag: "🇩🇪" },
  { iso: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { iso: "IT", name: "Italy", dial: "39", flag: "🇮🇹" },
  { iso: "NL", name: "Netherlands", dial: "31", flag: "🇳🇱" },
  { iso: "SE", name: "Sweden", dial: "46", flag: "🇸🇪" },
  { iso: "NO", name: "Norway", dial: "47", flag: "🇳🇴" },
  { iso: "CH", name: "Switzerland", dial: "41", flag: "🇨🇭" },
  { iso: "JP", name: "Japan", dial: "81", flag: "🇯🇵" },
  { iso: "KR", name: "South Korea", dial: "82", flag: "🇰🇷" },
  { iso: "CN", name: "China", dial: "86", flag: "🇨🇳" },
  { iso: "HK", name: "Hong Kong", dial: "852", flag: "🇭🇰" },
  { iso: "NZ", name: "New Zealand", dial: "64", flag: "🇳🇿" },
  { iso: "ZA", name: "South Africa", dial: "27", flag: "🇿🇦" },
  { iso: "NG", name: "Nigeria", dial: "234", flag: "🇳🇬" },
  { iso: "KE", name: "Kenya", dial: "254", flag: "🇰🇪" },
  { iso: "EG", name: "Egypt", dial: "20", flag: "🇪🇬" },
  { iso: "TR", name: "Türkiye", dial: "90", flag: "🇹🇷" },
  { iso: "RU", name: "Russia", dial: "7", flag: "🇷🇺" },
  { iso: "BR", name: "Brazil", dial: "55", flag: "🇧🇷" },
  { iso: "MX", name: "Mexico", dial: "52", flag: "🇲🇽" },
  { iso: "TH", name: "Thailand", dial: "66", flag: "🇹🇭" },
  { iso: "ID", name: "Indonesia", dial: "62", flag: "🇮🇩" },
  { iso: "PH", name: "Philippines", dial: "63", flag: "🇵🇭" },
  { iso: "VN", name: "Vietnam", dial: "84", flag: "🇻🇳" },
  { iso: "IE", name: "Ireland", dial: "353", flag: "🇮🇪" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function findCountryByDial(dial: string): Country | undefined {
  return COUNTRIES.find((c) => c.dial === dial);
}

export function findCountryByIso(iso: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso === iso);
}

/** National-number rules keyed by ISO. */
export function nationalPhoneRules(iso: string): {
  maxLength: number;
  placeholder: string;
  pattern?: RegExp;
  hint: string;
} {
  if (iso === "LK") {
    return {
      maxLength: 9,
      placeholder: "7X XXX XXXX",
      pattern: /^7\d{8}$/,
      hint: "9 digits starting with 7",
    };
  }
  return {
    maxLength: 15,
    placeholder: "Phone number",
    hint: "6–15 digits",
  };
}

export function composeE164(dial: string, national: string): string {
  const digits = national.replace(/\D/g, "");
  if (!digits) return "";
  return `+${dial}${digits}`;
}

export function parseE164(
  value: string
): { country: Country; national: string } | null {
  const normalized = value.trim().replace(/\s/g, "");
  if (!normalized.startsWith("+")) return null;

  const digits = normalized.slice(1);
  // Match longest dial code first
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const country of sorted) {
    if (digits.startsWith(country.dial)) {
      return { country, national: digits.slice(country.dial.length) };
    }
  }
  return null;
}
