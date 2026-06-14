"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function defaultViewYear() {
  return new Date().getFullYear() - 30;
}

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
}

export default function DatePicker({
  value,
  onChange,
  name,
  placeholder = "dd / mm / yyyy",
  minYear = 1920,
  maxYear = new Date().getFullYear(),
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    value ? parseInt(value.split("-")[0]) : defaultViewYear()
  );
  const [viewMonth, setViewMonth] = useState(
    value ? parseInt(value.split("-")[1]) - 1 : 0
  );
  const ref = useRef<HTMLDivElement>(null);

  const yearOptions = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function formatDisplay(dateStr: string) {
    const [y, m, d] = dateStr.split("-");
    return `${d} / ${m} / ${y}`;
  }

  function handleDayClick(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const isSelected = (day: number) =>
    !!selectedDate &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === day;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all backdrop-blur-sm"
      >
        <span className={value ? "text-white" : "text-white/30"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <CalendarDays className="w-4 h-4 text-gold/60 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 left-0 rounded-2xl border border-white/10 bg-[#0c1735] shadow-2xl p-4 w-72">
          {/* Year select */}
          <div className="mb-3">
            <label className="block text-[11px] font-medium text-white/40 mb-1.5">
              Year
            </label>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year} className="bg-[#0c1735] text-white">
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-white">
              {MONTHS[viewMonth]}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-medium text-white/30 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center">
                {day !== null ? (
                  <button
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      isSelected(day)
                        ? "bg-gold text-navy font-bold"
                        : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-3 pt-3 border-t border-white/[0.07]">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
