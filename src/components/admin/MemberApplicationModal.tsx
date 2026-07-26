"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Member, MemberRegistration } from "@/lib/types";

type MemberApplicationModalProps = {
  open: boolean;
  member: Member | null;
  onClose: () => void;
};

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  const display = value?.trim();
  if (!display) return null;
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-navy/40">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-navy break-words whitespace-pre-wrap">
        {display}
      </dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy/50">
        {title}
      </h4>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
        {children}
      </dl>
    </section>
  );
}

function registrationFields(r: MemberRegistration) {
  return (
    <>
      <Section title="Personal details">
        <DetailRow label="Salutation" value={r.salutation} />
        <DetailRow label="Full name" value={r.fullName} />
        <DetailRow label="Name with initials" value={r.nameWithInitials} />
        <DetailRow label="Preferred name" value={r.preferredName} />
        <DetailRow label="NIC" value={r.nic} />
        <DetailRow label="Date of birth" value={formatDate(r.dob) ?? r.dob} />
        <DetailRow label="Gender" value={r.gender} />
        <DetailRow label="Email" value={r.email} />
      </Section>

      <Section title="Contact & workplace">
        <DetailRow label="Mobile" value={r.mobile} />
        <DetailRow label="WhatsApp" value={r.preferredContact} />
        <DetailRow label="Residence telephone" value={r.residence} />
        <DetailRow label="Office" value={r.office} />
        <DetailRow label="Fax" value={r.fax} />
        <DetailRow label="Province" value={r.province} />
        <DetailRow label="Hospital / Institute" value={r.hospital} />
        <DetailRow label="Post" value={r.post} />
        <DetailRow label="Postal address" value={r.postalAddress} />
        <DetailRow label="Work address" value={r.workAddress} />
      </Section>

      <Section title="Professional qualifications">
        <DetailRow label="Medical degree" value={r.medicalDegree} />
        <DetailRow label="Medical school" value={r.medicalSchool} />
        <DetailRow
          label="Post graduate qualifications"
          value={r.pgQualifications}
        />
        <DetailRow label="Special interest" value={r.specialInterest} />
      </Section>
    </>
  );
}

/** Full signup details for a pending application, rendered via portal. */
export default function MemberApplicationModal({
  open,
  member,
  onClose,
}: MemberApplicationModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const reg = member?.registration;

  return createPortal(
    <AnimatePresence>
      {open && member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-dark/60 backdrop-blur-sm px-4 py-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-application-title"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-2xl max-h-[min(90vh,720px)] flex-col rounded-2xl bg-white shadow-2xl shadow-navy-dark/40 border border-navy/10"
          >
            <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-5 sm:px-6 py-4 flex-shrink-0">
              <div className="min-w-0">
                <h3
                  id="member-application-title"
                  className="font-heading text-lg font-bold text-navy truncate"
                >
                  {member.name}
                </h3>
                <p className="mt-0.5 text-sm text-navy/50 truncate">
                  {member.email}
                </p>
                {member.createdAt && (
                  <p className="mt-1 text-xs text-navy/40">
                    Applied {formatDate(member.createdAt)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-lg text-navy/50 hover:bg-navy/5 hover:text-navy transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
              {reg ? (
                registrationFields(reg)
              ) : (
                <p className="text-sm text-navy/50 py-4 text-center">
                  No registration details were saved for this application.
                </p>
              )}
            </div>

            <div className="flex justify-end border-t border-navy/10 px-5 sm:px-6 py-3.5 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-navy bg-navy/5 hover:bg-navy/10 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
