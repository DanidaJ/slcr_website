"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import RadioGroup from "@/components/ui/RadioGroup";
import DatePicker from "@/components/ui/DatePicker";
import HospitalCombobox from "@/components/ui/HospitalCombobox";
import {
  validateMobile,
  validateResidence,
} from "@/lib/validation/registration";
import type { Member, MemberRegistration } from "@/lib/types";

const SALUTATIONS = ["Dr.", "Dr (Mrs).", "Dr (Ms).", "Prof."];

const PROVINCES = [
  "Central", "Eastern", "North Central", "North Western",
  "Northern", "Sabaragamuwa", "Southern", "Western", "Uva",
];

const POSTS = [
  "Non Radiology Consultant", "Radiology Consultant",
  "Non Radiology Trainee", "Radiology Trainee",
];

const STATUS_LABELS: Record<Member["status"], string> = {
  active: "Active",
  pending: "Pending review",
  suspended: "Suspended",
};

type FieldErrors = Record<string, string | null>;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all backdrop-blur-sm";

const inputErrorClass =
  "border-red-400/50 focus:ring-red-400/30 focus:border-red-400/50";

const textareaClass = `${inputClass} resize-y`;

function fieldClass(error?: string | null) {
  return `${inputClass}${error ? ` ${inputErrorClass}` : ""}`;
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1.5">
        {label}
        {required && <span className="text-gold ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SectionLegend({ children }: { children: React.ReactNode }) {
  return (
    <legend className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-3 mb-6">
      <div className="w-1.5 h-6 rounded-full bg-gold" />
      {children}
    </legend>
  );
}

function PasswordField({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string | null;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-11 ${error ? inputErrorClass : ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function ProfileForm({
  name,
  email,
  memberNumber,
  status,
  registration,
}: {
  name: string;
  email: string;
  memberNumber?: string;
  status: Member["status"];
  registration: MemberRegistration;
}) {
  const r = registration;
  const [salutation, setSalutation] = useState(r.salutation ?? "");
  const [fullName, setFullName] = useState(r.fullName ?? name ?? "");
  const [nameWithInitials, setNameWithInitials] = useState(r.nameWithInitials ?? "");
  const [preferredName, setPreferredName] = useState(r.preferredName ?? "");
  const [nic, setNic] = useState(r.nic ?? "");
  const [dob, setDob] = useState(r.dob ?? "");
  const [gender, setGender] = useState(r.gender ?? "");
  const [province, setProvince] = useState(r.province ?? "");
  const [hospital, setHospital] = useState(r.hospital ?? "");
  const [post, setPost] = useState(r.post ?? "");
  const [mobile, setMobile] = useState(r.mobile ?? "");
  const [preferredContact, setPreferredContact] = useState(r.preferredContact ?? "");
  const [residence, setResidence] = useState(r.residence ?? "");
  const [medicalDegree, setMedicalDegree] = useState(r.medicalDegree ?? "");
  const [medicalSchool, setMedicalSchool] = useState(r.medicalSchool ?? "");
  const [pgQualifications, setPgQualifications] = useState(r.pgQualifications ?? "");
  const [specialInterest, setSpecialInterest] = useState(r.specialInterest ?? "");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  function setFieldError(field: string, message: string | null) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!fullName.trim()) next.fullName = "Full name is required.";
    next.mobile = validateMobile(mobile, "Mobile number");
    if (preferredContact.trim()) {
      next.preferredContact = validateMobile(preferredContact, "WhatsApp number");
    }
    next.residence = validateResidence(residence);
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v)
    );
    setErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salutation,
          fullName,
          nameWithInitials,
          preferredName,
          nic,
          dob,
          gender,
          province,
          hospital,
          post,
          mobile,
          preferredContact,
          residence,
          medicalDegree,
          medicalSchool,
          pgQualifications,
          specialInterest,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Could not save your changes. Please try again.");
        return;
      }
      setSaved(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div ref={topRef} className="scroll-mt-32" />

      {/* Read-only account summary */}
      <section className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-navy mb-1">
          Account
        </h2>
        <p className="text-sm text-navy/55 mb-5">
          These details are managed by the College and can&apos;t be edited here.
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-navy/45">
              Email / Username
            </dt>
            <dd className="mt-1 text-sm text-navy break-all">{email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-navy/45">
              Membership No
            </dt>
            <dd className="mt-1 text-sm text-navy">
              {memberNumber || <span className="text-navy/40">Not assigned</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-navy/45">
              Status
            </dt>
            <dd className="mt-1 text-sm text-navy">{STATUS_LABELS[status]}</dd>
          </div>
        </dl>
      </section>

      {/* Editable registration details */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-navy-dark border border-navy-light/20 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 space-y-10"
      >
        <fieldset>
          <SectionLegend>Personal Information</SectionLegend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Salutation">
              <CustomSelect
                options={SALUTATIONS}
                value={salutation}
                onChange={setSalutation}
              />
            </FormField>

            <FormField label="Full Name" required error={errors.fullName}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setFieldError("fullName", e.target.value.trim() ? null : "Full name is required.");
                }}
                placeholder="As appears in NIC or Travel document"
                className={fieldClass(errors.fullName)}
              />
            </FormField>

            <FormField label="Name With Initials">
              <input
                type="text"
                value={nameWithInitials}
                onChange={(e) => setNameWithInitials(e.target.value)}
                placeholder="J. Doe"
                className={inputClass}
              />
            </FormField>

            <FormField label="Preferred Name">
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="John"
                className={inputClass}
              />
            </FormField>

            <FormField label="National Identity Card No (NIC)">
              <input
                type="text"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                placeholder="199012345678V"
                className={inputClass}
              />
            </FormField>

            <FormField label="Date of Birth">
              <DatePicker name="dob" value={dob} onChange={setDob} />
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Gender">
                <RadioGroup
                  options={["Male", "Female"]}
                  value={gender}
                  onChange={setGender}
                />
              </FormField>
            </div>
          </div>
        </fieldset>

        <div className="h-px bg-white/[0.06]" />

        <fieldset>
          <SectionLegend>Contact Information</SectionLegend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <FormField label="Hospital / Institute">
                <HospitalCombobox
                  name="hospital"
                  value={hospital}
                  onChange={setHospital}
                  inputClassName={inputClass}
                  errorClassName={inputErrorClass}
                />
              </FormField>
            </div>

            <FormField label="Province">
              <CustomSelect
                options={PROVINCES}
                value={province}
                onChange={setProvince}
              />
            </FormField>

            <FormField label="Post">
              <CustomSelect options={POSTS} value={post} onChange={setPost} />
            </FormField>

            <FormField label="Mobile Number" required error={errors.mobile}>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (errors.mobile) setFieldError("mobile", validateMobile(e.target.value, "Mobile number"));
                }}
                placeholder="07X XXX XXXX or +94 7X XXX XXXX"
                className={fieldClass(errors.mobile)}
              />
            </FormField>

            <FormField label="WhatsApp Number" error={errors.preferredContact}>
              <input
                type="tel"
                value={preferredContact}
                onChange={(e) => {
                  setPreferredContact(e.target.value);
                  if (errors.preferredContact) {
                    setFieldError(
                      "preferredContact",
                      e.target.value.trim() ? validateMobile(e.target.value, "WhatsApp number") : null
                    );
                  }
                }}
                placeholder="07X XXX XXXX or +94 7X XXX XXXX"
                className={fieldClass(errors.preferredContact)}
              />
            </FormField>

            <FormField label="Residence Telephone Number" error={errors.residence}>
              <input
                type="tel"
                value={residence}
                onChange={(e) => {
                  setResidence(e.target.value);
                  if (errors.residence) setFieldError("residence", validateResidence(e.target.value));
                }}
                placeholder="011 XXXXXXX"
                className={fieldClass(errors.residence)}
              />
            </FormField>
          </div>
        </fieldset>

        <div className="h-px bg-white/[0.06]" />

        <fieldset>
          <SectionLegend>Professional Qualification</SectionLegend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <FormField label="Medical Degree (with dates)">
                <textarea
                  rows={2}
                  value={medicalDegree}
                  onChange={(e) => setMedicalDegree(e.target.value)}
                  placeholder="MBBS (University of Colombo, 2015)"
                  className={textareaClass}
                />
              </FormField>
            </div>

            <FormField label="Medical School">
              <input
                type="text"
                value={medicalSchool}
                onChange={(e) => setMedicalSchool(e.target.value)}
                placeholder="Faculty of Medicine, University of Colombo"
                className={inputClass}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Post Graduate Qualifications (with dates)">
                <textarea
                  rows={2}
                  value={pgQualifications}
                  onChange={(e) => setPgQualifications(e.target.value)}
                  placeholder="a) Diagnostic Radiology / Radiotherapy & Oncology  b) Other Qualifications"
                  className={textareaClass}
                />
              </FormField>
            </div>
          </div>
        </fieldset>

        <div className="h-px bg-white/[0.06]" />

        <fieldset>
          <SectionLegend>Special Interest</SectionLegend>
          <FormField label="Special Interest">
            <textarea
              rows={2}
              value={specialInterest}
              onChange={(e) => setSpecialInterest(e.target.value)}
              placeholder="e.g. Neuroradiology, Interventional Radiology"
              className={textareaClass}
            />
          </FormField>
        </fieldset>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="flex items-start gap-2.5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Your profile has been updated.</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gold text-navy text-sm font-bold uppercase tracking-wide hover:bg-gold-light disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <PasswordChangeCard />
    </div>
  );
}

function PasswordChangeCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);

    const next: FieldErrors = {};
    if (!currentPassword) next.currentPassword = "Enter your current password.";
    if (!newPassword) next.newPassword = "Enter a new password.";
    else if (newPassword.length < 8) next.newPassword = "Must be at least 8 characters.";
    if (confirmPassword !== newPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Could not change your password.");
        return;
      }
      setDone(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-navy-dark border border-navy-light/20 px-6 sm:px-8 lg:px-10 py-8 sm:py-10"
    >
      <legend className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-3 mb-2">
        <Lock className="w-4 h-4 text-gold" />
        Change Password
      </legend>
      <p className="text-sm text-white/50 mb-6">
        Update the password you use to sign in with your email.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <FormField label="Current Password" required error={errors.currentPassword}>
            <PasswordField
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="••••••••"
              error={errors.currentPassword}
            />
          </FormField>
        </div>

        <FormField label="New Password" required error={errors.newPassword}>
          <PasswordField
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
            error={errors.newPassword}
          />
        </FormField>

        <FormField label="Confirm New Password" required error={errors.confirmPassword}>
          <PasswordField
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            error={errors.confirmPassword}
          />
        </FormField>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {done && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Your password has been changed.</span>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-gold/50 text-gold text-sm font-bold uppercase tracking-wide hover:bg-gold/10 disabled:opacity-60 transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Updating…" : "Update password"}
        </button>
      </div>
    </form>
  );
}
