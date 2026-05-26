"use client";

interface RadioGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
}: RadioGroupProps) {
  return (
    <div className="flex items-center gap-5 mt-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex items-center gap-2.5 group"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                active
                  ? "border-gold"
                  : "border-white/25 group-hover:border-white/50"
              }`}
            >
              {active && (
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
              )}
            </div>
            <span
              className={`text-sm transition-colors ${
                active ? "text-white font-medium" : "text-white/60 group-hover:text-white/80"
              }`}
            >
              {opt}
            </span>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={active}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
          </button>
        );
      })}
    </div>
  );
}
