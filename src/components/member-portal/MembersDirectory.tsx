"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, Loader2 } from "lucide-react";

type DirectoryMember = {
  memberNumber: string;
  name: string;
  mobile: string;
  hospital: string;
};

type SortColumn = "name" | "hospital";
type SortDirection = "asc" | "desc";

function compareText(a: string, b: string, direction: SortDirection): number {
  const result = a.localeCompare(b, undefined, { sensitivity: "base" });
  return direction === "asc" ? result : -result;
}

function SortHeaderButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  const Icon = active && direction === "desc" ? ArrowUpAZ : ArrowDownAZ;
  const nextHint =
    !active || direction === "desc" ? "Sort A to Z" : "Sort Z to A";

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 -ml-1.5 text-left hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      aria-label={`${label}: ${nextHint}`}
      title={nextHint}
    >
      <span>{label}</span>
      <Icon
        className={`w-3.5 h-3.5 shrink-0 ${
          active ? "text-gold" : "text-white/55"
        }`}
        aria-hidden
      />
    </button>
  );
}

export default function MembersDirectory() {
  const [members, setMembers] = useState<DirectoryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    let active = true;

    fetch("/api/member/directory")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Could not load members.");
        }
        return res.json();
      })
      .then((data) => {
        if (active) setMembers(data.members ?? []);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function toggleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  const rows = useMemo(() => {
    if (!sortColumn) return members;
    return [...members].sort((a, b) =>
      compareText(a[sortColumn], b[sortColumn], sortDirection)
    );
  }, [members, sortColumn, sortDirection]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy text-white">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                Membership number
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                <SortHeaderButton
                  label="Name"
                  active={sortColumn === "name"}
                  direction={sortDirection}
                  onClick={() => toggleSort("name")}
                />
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                Mobile number
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                <SortHeaderButton
                  label="Hospital"
                  active={sortColumn === "hospital"}
                  direction={sortDirection}
                  onClick={() => toggleSort("hospital")}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-navy/50 text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading…
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-red-600 text-sm"
                >
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-navy/50 text-sm"
                >
                  No members to show yet.
                </td>
              </tr>
            ) : (
              rows.map((member, i) => (
                <tr
                  key={`${member.memberNumber}-${member.name}-${i}`}
                  className={`border-t border-gray-100 ${
                    i % 2 === 1 ? "bg-surface/60" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-navy whitespace-nowrap">
                    {member.memberNumber || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-navy/80">
                    {member.name || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-navy/80 whitespace-nowrap">
                    {member.mobile || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-navy/80">
                    {member.hospital || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
