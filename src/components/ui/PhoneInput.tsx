"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  composeE164,
  nationalPhoneRules,
  parseE164,
  type Country,
} from "@/lib/countries";

interface PhoneInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  defaultIso?: string;
}

export default function PhoneInput({
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  defaultIso = "LK",
}: PhoneInputProps) {
  const parsed = value ? parseE164(value) : null;
  const initialCountry =
    parsed?.country ??
    COUNTRIES.find((c) => c.iso === defaultIso) ??
    DEFAULT_COUNTRY;

  const [country, setCountry] = useState<Country>(initialCountry);
  const [national, setNational] = useState(parsed?.national ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const rules = nationalPhoneRules(country.iso);

  // Sync when parent updates value (e.g. "same as mobile"), prefer current dial code
  useEffect(() => {
    if (!value) {
      setNational("");
      return;
    }
    const digits = value.replace(/^\+/, "").replace(/\D/g, "");
    if (digits.startsWith(country.dial)) {
      setNational(digits.slice(country.dial.length));
      return;
    }
    const next = parseE164(value);
    if (next) {
      setCountry(next.country);
      setNational(next.national);
    }
  }, [value, country.dial]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q.replace(/^\+/, "")) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [query]);

  function emit(nextCountry: Country, nextNational: string) {
    onChange(composeE164(nextCountry.dial, nextNational));
  }

  function handleNationalChange(raw: string) {
    let digits = raw.replace(/\D/g, "");
    // Local Sri Lankan pastes often include leading 0 (07X…)
    if (country.iso === "LK" && digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, rules.maxLength);
    setNational(digits);
    emit(country, digits);
  }

  function selectCountry(next: Country) {
    setCountry(next);
    setOpen(false);
    setQuery("");
    const nextRules = nationalPhoneRules(next.iso);
    const trimmed = national.slice(0, nextRules.maxLength);
    setNational(trimmed);
    emit(next, trimmed);
  }

  function handleBlur() {
    onBlur?.(composeE164(country.dial, national));
  }

  const shellClass = `flex items-stretch rounded-xl border bg-white/[0.07] backdrop-blur-sm transition-all ${
    error
      ? "border-red-400/50 focus-within:ring-2 focus-within:ring-red-400/30 focus-within:border-red-400/50"
      : "border-white/10 focus-within:ring-2 focus-within:ring-gold/30 focus-within:border-gold/40"
  } ${disabled ? "opacity-50 pointer-events-none" : ""}`;

  return (
    <div ref={rootRef} className="relative">
      <div className={shellClass}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 pl-3 pr-2.5 py-3 text-sm text-white shrink-0 hover:bg-white/[0.04] rounded-l-xl transition-colors"
          aria-label="Select country code"
          aria-expanded={open}
        >
          <span className="text-base leading-none" aria-hidden>
            {country.flag}
          </span>
          <span className="font-medium tabular-nums">+{country.dial}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gold/60 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="w-px self-stretch my-2.5 bg-white/15" aria-hidden />

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          value={national}
          onChange={(e) => handleNationalChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={rules.placeholder}
          maxLength={rules.maxLength}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none rounded-r-xl"
        />
      </div>

      <input type="hidden" name={name} value={value} />

      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[280px] rounded-xl border border-white/10 bg-[#0c1735] shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/[0.07]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code"
                className="w-full rounded-lg border border-white/10 bg-white/[0.07] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40"
              />
            </div>
          </div>

          <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-white/40">No countries found</li>
            ) : (
              filtered.map((c) => {
                const selected = c.iso === country.iso;
                return (
                  <li key={`${c.iso}-${c.dial}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectCountry(c)}
                      className={`w-full px-3 py-2.5 text-sm text-left flex items-center gap-2.5 transition-colors ${
                        selected
                          ? "bg-gold/15 text-gold"
                          : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="text-base leading-none w-6 text-center" aria-hidden>
                        {c.flag}
                      </span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="tabular-nums text-white/45">+{c.dial}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
