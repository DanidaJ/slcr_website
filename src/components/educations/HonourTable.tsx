"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  HONOUR_CONFIG,
  type HonourCategory,
  type HonourColumnKey,
  type HonourRecord,
} from "@/lib/honours";

type BlankRow = Record<HonourColumnKey, string>;

function emptyRow(): BlankRow {
  return { name: "", award: "", year: "" };
}

export default function HonourTable({
  category,
}: {
  category: HonourCategory;
}) {
  const config = HONOUR_CONFIG[category];

  const [records, setRecords] = useState<HonourRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [draft, setDraft] = useState<BlankRow>(emptyRow);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`/api/honours/${category}`)
      .then((r) => r.json())
      .then((d) => {
        if (active) setRecords(d.records ?? []);
      })
      .catch(() => null)
      .finally(() => {
        if (active) setLoading(false);
      });

    fetch("/api/auth/member")
      .then((r) => r.json())
      .then((d) => {
        if (active) setIsAdmin(d.member?.role === "admin");
      })
      .catch(() => null);

    return () => {
      active = false;
    };
  }, [category]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: Record<string, string> = {};
    for (const col of config.columns) {
      const value = draft[col.key].trim();
      if (!value) {
        setError(`${col.label} is required.`);
        return;
      }
      payload[col.key] = value;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/honours/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add record.");

      setRecords((prev) => [...prev, data.record]);
      setDraft(emptyRow());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    if (!id) return;

    const res = await fetch(`/api/honours/${category}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } else {
      alert("Failed to delete record.");
    }
  }

  const colCount = config.columns.length + (isAdmin ? 1 : 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy text-white">
              {config.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {isAdmin && (
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-5 py-10 text-center text-navy/50 text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading…
                  </span>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-5 py-10 text-center text-navy/50 text-sm"
                >
                  No records yet.
                </td>
              </tr>
            ) : (
              records.map((record, i) => (
                <tr
                  key={record._id}
                  className={`border-t border-gray-100 ${
                    i % 2 === 1 ? "bg-surface/60" : ""
                  }`}
                >
                  {config.columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-5 py-3.5 text-sm text-navy/80"
                    >
                      {record[col.key] ?? ""}
                    </td>
                  ))}
                  {isAdmin && (
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setPendingDeleteId(record._id)}
                        className="p-1.5 rounded-md text-navy/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin-only add-row form */}
      {isAdmin && (
        <form
          onSubmit={handleAdd}
          className="border-t border-gray-100 bg-surface/40 p-4 sm:p-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-navy/45 mb-3">
            Add a record
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            {config.columns.map((col) => (
              <div key={col.key} className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-navy/60 mb-1">
                  {col.label}
                </label>
                <input
                  value={draft[col.key]}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, [col.key]: e.target.value }))
                  }
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
                  placeholder={col.label}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2 text-sm text-white font-semibold hover:bg-navy-light disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {saving ? "Adding…" : "Add Row"}
            </button>
          </div>

          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </form>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this record?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
