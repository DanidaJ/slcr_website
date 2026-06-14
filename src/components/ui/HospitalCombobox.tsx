"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// TODO: Replace with the actual Hospital / Institute list provided by SLCR.
export const HOSPITAL_SUGGESTIONS = [
  "National Hospital of Sri Lanka",
  "Colombo South Teaching Hospital",
  "Sri Jayewardenepura General Hospital",
  "North Colombo Teaching Hospital",
  "Lady Ridgeway Hospital for Children",
  "Castle Street Hospital for Women",
  "Teaching Hospital Karapitiya",
  "Teaching Hospital Kandy",
  "Teaching Hospital Anuradhapura",
  "Teaching Hospital Jaffna",
  "Teaching Hospital Batticaloa",
  "Teaching Hospital Ragama",
  "District General Hospital Galle",
  "District General Hospital Matara",
  "Asiri Central Hospital",
  "Lanka Hospitals",
  "Nawaloka Hospital",
];

interface HospitalComboboxProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  error?: string | null;
  inputClassName: string;
  errorClassName?: string;
}

export default function HospitalCombobox({
  value,
  onChange,
  name,
  error,
  inputClassName,
  errorClassName = "",
}: HospitalComboboxProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const query = value.trim().toLowerCase();
  const filtered = query
    ? HOSPITAL_SUGGESTIONS.filter((h) => h.toLowerCase().includes(query))
    : HOSPITAL_SUGGESTIONS;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          name={name}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Start typing or choose from the list"
          autoComplete="off"
          className={`${inputClassName} pr-10 ${error ? errorClassName : ""}`}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
          aria-label="Show hospital suggestions"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1.5 w-full max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[#0c1735] shadow-2xl py-1">
          {filtered.map((hospital) => (
            <li key={hospital}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(hospital);
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                {hospital}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
