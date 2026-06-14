"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import CustomSelect from "@/components/ui/CustomSelect";
import RadioGroup from "@/components/ui/RadioGroup";
import DatePicker from "@/components/ui/DatePicker";
import HospitalCombobox from "@/components/ui/HospitalCombobox";
import {
  validateEmail,
  validateMobile,
  validateResidence,
} from "@/lib/validation/registration";

const VIEWPORT = { once: true, margin: "-60px" } as const;

const SALUTATIONS = ["Dr.", "Dr (Mrs).", "Dr (Ms).", "Prof."];

const PROVINCES = [
  "Central", "Eastern", "North Central", "North Western",
  "Northern", "Sabaragamuwa", "Southern", "Western", "Uva",
];

const POSTS = [
  "Non Radiology Consultant", "Radiology Consultant",
  "Non Radiology Trainee", "Radiology Trainee",
];

type FieldErrors = Record<string, string | null>;

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

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all backdrop-blur-sm";

const inputErrorClass =
  "border-red-400/50 focus:ring-red-400/30 focus:border-red-400/50";

const textareaClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all backdrop-blur-sm resize-y";

function SectionLegend({ children }: { children: React.ReactNode }) {
  return (
    <legend className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-3 mb-6">
      <div className="w-1.5 h-6 rounded-full bg-gold" />
      {children}
    </legend>
  );
}

function PasswordField({
  name,
  placeholder,
  error,
  onBlur,
}: {
  name: string;
  placeholder?: string;
  error?: string | null;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        onBlur={onBlur}
        className={`${inputClass} pr-11 ${error ? inputErrorClass : ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

function fieldClass(error?: string | null) {
  return `${inputClass}${error ? ` ${inputErrorClass}` : ""}`;
}

export default function RegisterForm() {
  const [salutation, setSalutation] = useState("");
  const [province, setProvince] = useState("");
  const [post, setPost] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [hospital, setHospital] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function setFieldError(field: string, message: string | null) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function showError(field: string) {
    return touched[field] ? errors[field] : null;
  }

  function validateField(field: string, value: string, form?: HTMLFormElement) {
    switch (field) {
      case "fullName":
        return value.trim() ? null : "Full name is required.";
      case "nameWithInitials":
        return value.trim() ? null : "Name with initials is required.";
      case "nic":
        return value.trim() ? null : "NIC is required.";
      case "email":
        return validateEmail(value);
      case "confirmEmail": {
        const emailInput = form?.elements.namedItem("email");
        const emailVal =
          emailInput instanceof HTMLInputElement ? emailInput.value : email;
        if (!value.trim()) return "Please confirm your email.";
        if (value.trim().toLowerCase() !== emailVal.trim().toLowerCase()) {
          return "Email addresses do not match.";
        }
        return null;
      }
      case "mobile":
        return validateMobile(value, "Mobile number");
      case "preferredContact":
        return validateMobile(value, "WhatsApp number");
      case "residence":
        return validateResidence(value);
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        return null;
      case "confirmPassword": {
        const passwordInput = form?.elements.namedItem("password");
        const passwordVal =
          passwordInput instanceof HTMLInputElement ? passwordInput.value : "";
        if (!value) return "Please confirm your password.";
        if (value !== passwordVal) return "Passwords do not match.";
        return null;
      }
      default:
        return null;
    }
  }

  function handleBlur(field: string, value: string) {
    touch(field);
    const form = formRef.current ?? undefined;
    setFieldError(field, validateField(field, value, form));
  }

  function validateForm(form: HTMLFormElement): boolean {
    const data = new FormData(form);
    const nextErrors: FieldErrors = {};

    if (!salutation) nextErrors.salutation = "Salutation is required.";
    if (!gender) nextErrors.gender = "Gender is required.";
    if (!post) nextErrors.post = "Post is required.";

    const textFields = [
      "fullName",
      "nameWithInitials",
      "nic",
      "email",
      "confirmEmail",
      "mobile",
      "preferredContact",
      "residence",
      "password",
      "confirmPassword",
    ] as const;

    for (const field of textFields) {
      const value = (data.get(field) as string) ?? "";
      const message = validateField(field, value, form);
      if (message) nextErrors[field] = message;
    }

    setErrors(nextErrors);
    setTouched({
      salutation: true,
      gender: true,
      post: true,
      ...Object.fromEntries(textFields.map((f) => [f, true])),
    });

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    if (!validateForm(form)) return;

    const data = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch("/api/membership/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salutation,
          fullName: data.get("fullName"),
          nameWithInitials: data.get("nameWithInitials"),
          preferredName: data.get("preferredName"),
          nic: data.get("nic"),
          dob,
          gender,
          email: data.get("email"),
          province,
          hospital,
          post,
          mobile: data.get("mobile"),
          residence: data.get("residence"),
          preferredContact: data.get("preferredContact"),
          medicalDegree: data.get("medicalDegree"),
          medicalSchool: data.get("medicalSchool"),
          pgQualifications: data.get("pgQualifications"),
          specialInterest: data.get("specialInterest"),
          username: data.get("email"),
          password: data.get("password"),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Registration failed. Please try again.");
        return;
      }
      setSuccess(true);
      formRef.current?.reset();
      setSalutation("");
      setProvince("");
      setPost("");
      setGender("");
      setDob("");
      setEmail("");
      setHospital("");
      setErrors({});
      setTouched({});
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <motion.div
        variants={fadeUp()}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-navy border border-navy-light/30 px-6 sm:px-8 lg:px-10 py-16 text-center"
      >
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white mb-3">
          Application Submitted
        </h2>
        <p className="text-sm text-white/60 max-w-sm mx-auto leading-relaxed">
          Your application is pending review by the College. You will be able
          to sign in once an administrator approves your account.
        </p>
        <div className="mt-6 w-12 h-0.5 bg-gold mx-auto" />
        <p className="mt-6 text-sm text-white/40">
          Already approved?{" "}
          <Link
            href="/membership/member-login"
            className="font-semibold text-gold hover:text-gold-light transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="rounded-t-2xl bg-navy border border-navy-light/30 px-6 sm:px-8 lg:px-10 pt-8 pb-6 text-center">
        <Image
          src="/images/logo.png"
          alt="SLCR"
          width={56}
          height={56}
          className="object-contain mx-auto mb-4"
        />
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
          Become a Member
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Fill in the form below to register with the Sri Lanka College of
          Radiologists
        </p>
        <div className="mt-3 w-12 h-0.5 bg-gold mx-auto" />
      </div>

      <div className="rounded-b-2xl bg-navy-dark border border-t-0 border-navy-light/20 px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
          <fieldset>
            <SectionLegend>Personal Information</SectionLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Salutation" required error={showError("salutation")}>
                <CustomSelect
                  name="salutation"
                  options={SALUTATIONS}
                  value={salutation}
                  onChange={(v) => {
                    setSalutation(v);
                    touch("salutation");
                    setFieldError("salutation", v ? null : "Salutation is required.");
                  }}
                />
              </FormField>

              <FormField label="Full Name" required error={showError("fullName")}>
                <input
                  name="fullName"
                  type="text"
                  placeholder="As appears in NIC or Travel document"
                  className={fieldClass(showError("fullName"))}
                  onBlur={(e) => handleBlur("fullName", e.target.value)}
                />
              </FormField>

              <FormField label="Name With Initials" required error={showError("nameWithInitials")}>
                <input
                  name="nameWithInitials"
                  type="text"
                  placeholder="J. Doe"
                  className={fieldClass(showError("nameWithInitials"))}
                  onBlur={(e) => handleBlur("nameWithInitials", e.target.value)}
                />
              </FormField>

              <FormField label="Preferred Name">
                <input
                  name="preferredName"
                  type="text"
                  placeholder="John"
                  className={inputClass}
                />
              </FormField>

              <FormField label="National Identity Card No (NIC)" required error={showError("nic")}>
                <input
                  name="nic"
                  type="text"
                  placeholder="199012345678V"
                  className={fieldClass(showError("nic"))}
                  onBlur={(e) => handleBlur("nic", e.target.value)}
                />
              </FormField>

              <FormField label="Date of Birth">
                <DatePicker name="dob" value={dob} onChange={setDob} />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Gender" required error={showError("gender")}>
                  <RadioGroup
                    name="gender"
                    options={["Male", "Female"]}
                    value={gender}
                    onChange={(v) => {
                      setGender(v);
                      touch("gender");
                      setFieldError("gender", v ? null : "Gender is required.");
                    }}
                  />
                </FormField>
              </div>
            </div>
          </fieldset>

          <div className="h-px bg-white/[0.06]" />

          <fieldset>
            <SectionLegend>Contact Information</SectionLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Email" required error={showError("email")}>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) {
                      setFieldError("email", validateEmail(e.target.value));
                    }
                  }}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  className={fieldClass(showError("email"))}
                />
              </FormField>

              <FormField label="Confirm Email" required error={showError("confirmEmail")}>
                <input
                  name="confirmEmail"
                  type="email"
                  placeholder="Confirm your email"
                  className={fieldClass(showError("confirmEmail"))}
                  onBlur={(e) => handleBlur("confirmEmail", e.target.value)}
                />
              </FormField>

              {/* Postal address temporarily hidden
              <div className="sm:col-span-2">
                <FormField label="Postal Address" required>
                  <textarea
                    name="postalAddress"
                    rows={2}
                    className={textareaClass}
                  />
                </FormField>
              </div>
              */}

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
                  name="province"
                  options={PROVINCES}
                  value={province}
                  onChange={setProvince}
                />
              </FormField>

              <FormField label="Post" required error={showError("post")}>
                <CustomSelect
                  name="post"
                  options={POSTS}
                  value={post}
                  onChange={(v) => {
                    setPost(v);
                    touch("post");
                    setFieldError("post", v ? null : "Post is required.");
                  }}
                />
              </FormField>

              <FormField label="Mobile Number" required error={showError("mobile")}>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="07X XXX XXXX or +94 7X XXX XXXX"
                  className={fieldClass(showError("mobile"))}
                  onBlur={(e) => handleBlur("mobile", e.target.value)}
                />
              </FormField>

              <FormField label="WhatsApp Number" required error={showError("preferredContact")}>
                <input
                  name="preferredContact"
                  type="tel"
                  placeholder="07X XXX XXXX or +94 7X XXX XXXX"
                  className={fieldClass(showError("preferredContact"))}
                  onBlur={(e) => handleBlur("preferredContact", e.target.value)}
                />
              </FormField>

              <FormField label="Residence Telephone Number" error={showError("residence")}>
                <input
                  name="residence"
                  type="tel"
                  placeholder="011 XXXXXXX"
                  className={fieldClass(showError("residence"))}
                  onBlur={(e) => handleBlur("residence", e.target.value)}
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
                    name="medicalDegree"
                    rows={2}
                    placeholder="MBBS (University of Colombo, 2015)"
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <FormField label="Medical School">
                <input
                  name="medicalSchool"
                  type="text"
                  placeholder="Faculty of Medicine, University of Colombo"
                  className={inputClass}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Post Graduate Qualifications (with dates)">
                  <textarea
                    name="pgQualifications"
                    rows={2}
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
                name="specialInterest"
                rows={2}
                placeholder="e.g. Neuroradiology, Interventional Radiology"
                className={textareaClass}
              />
            </FormField>
          </fieldset>

          <div className="h-px bg-white/[0.06]" />

          <fieldset>
            <SectionLegend>User Credentials</SectionLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FormField label="Username" required>
                  <input
                    type="text"
                    readOnly
                    value={email}
                    placeholder="Same as your email above"
                    className={`${inputClass} text-white/60 cursor-default focus:ring-0 focus:border-white/10`}
                    tabIndex={-1}
                  />
                </FormField>
              </div>

              <FormField label="Password" required error={showError("password")}>
                <PasswordField
                  name="password"
                  placeholder="••••••••"
                  error={showError("password")}
                  onBlur={(e) => handleBlur("password", e.target.value)}
                />
              </FormField>

              <FormField label="Confirm Password" required error={showError("confirmPassword")}>
                <PasswordField
                  name="confirmPassword"
                  placeholder="••••••••"
                  error={showError("confirmPassword")}
                  onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                />
              </FormField>
            </div>
          </fieldset>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 space-y-6">
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-full max-w-md inline-flex items-center justify-center gap-2 px-12 py-4 rounded-xl bg-gold text-navy text-sm font-bold uppercase tracking-wide hover:bg-gold-light disabled:opacity-60 transition-colors duration-300"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Submitting…" : "Register"}
              </button>
            </div>

            <div className="border-t border-white/[0.06] pt-6">
              <p className="text-center text-sm text-white/40">
                Already a member?{" "}
                <Link
                  href="/membership/member-login"
                  className="font-semibold text-gold hover:text-gold-light transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
