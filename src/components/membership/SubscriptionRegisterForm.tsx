"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "-60px" } as const;

const SALUTATIONS = ["Dr.", "Dr (Mrs).", "Dr (Ms).", "Prof."];

const PROVINCES = [
  "Central",
  "Eastern",
  "North Central",
  "North Western",
  "Northern",
  "Sabaragamuwa",
  "Southern",
  "Western",
  "Uva",
];

const POSTS = [
  "Non Radiology Consultant",
  "Radiology Consultant",
  "Non Radiology Trainee",
  "Radiology Trainee",
];

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy/70 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-navy/10 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all";

const selectClass =
  "w-full rounded-lg border border-navy/10 bg-white px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230D1442%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10";

const textareaClass =
  "w-full rounded-lg border border-navy/10 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-y";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gold/30">
      <h3 className="font-heading text-base sm:text-lg font-bold text-navy">
        {children}
      </h3>
    </div>
  );
}

export default function SubscriptionRegisterForm() {
  return (
    <motion.div
      variants={fadeUp()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="rounded-2xl border border-navy/10 bg-surface shadow-sm overflow-hidden"
    >
      {/* Gold top accent */}
      <div className="h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold" />

      <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
        <form className="space-y-8">
          {/* Personal Information */}
          <fieldset>
            <SectionHeader>Personal Information</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Salutation" required>
                <select
                  name="salutation"
                  className={selectClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Select --
                  </option>
                  {SALUTATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Full Name" required>
                <input
                  name="fullName"
                  type="text"
                  placeholder="As appears in NIC or Travel document"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Name With Initials" required>
                <input
                  name="nameWithInitials"
                  type="text"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Preferred Name">
                <input
                  name="preferredName"
                  type="text"
                  className={inputClass}
                />
              </FormField>

              <FormField label="National Identity Card No (NIC)" required>
                <input name="nic" type="text" className={inputClass} />
              </FormField>

              <FormField label="Date of Birth">
                <input name="dob" type="date" className={inputClass} />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Gender" required>
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="text-sm text-navy/70">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="text-sm text-navy/70">Female</span>
                    </label>
                  </div>
                </FormField>
              </div>
            </div>
          </fieldset>

          {/* Contact Information */}
          <fieldset>
            <SectionHeader>Contact Information</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email" required>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Confirm Email" required>
                <input
                  name="confirmEmail"
                  type="email"
                  placeholder="Confirm your email"
                  className={inputClass}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Postal Address" required>
                  <textarea
                    name="postalAddress"
                    rows={2}
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <div className="sm:col-span-2">
                <FormField label="Place of Work and Address">
                  <textarea
                    name="workAddress"
                    rows={2}
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <FormField label="Province">
                <select
                  name="province"
                  className={selectClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Select --
                  </option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Hospital / Institute">
                <input name="hospital" type="text" className={inputClass} />
              </FormField>

              <FormField label="Post" required>
                <select name="post" className={selectClass} defaultValue="">
                  <option value="" disabled>
                    -- Select --
                  </option>
                  {POSTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="sm:col-span-2 mt-1">
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wider mb-3">
                  Contact Phone Numbers
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Mobile" required>
                    <input
                      name="mobile"
                      type="tel"
                      placeholder="+94 7X XXX XXXX"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Office">
                    <input name="office" type="tel" className={inputClass} />
                  </FormField>

                  <FormField label="Residence">
                    <input name="residence" type="tel" className={inputClass} />
                  </FormField>

                  <FormField label="Fax">
                    <input name="fax" type="tel" className={inputClass} />
                  </FormField>
                </div>
              </div>

              <div className="sm:col-span-2">
                <FormField label="Preferred Contact Number for Communication" required>
                  <input
                    name="preferredContact"
                    type="tel"
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>
          </fieldset>

          {/* Professional Qualification */}
          <fieldset>
            <SectionHeader>Professional Qualification</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FormField label="Medical Degree (with details)">
                  <textarea
                    name="medicalDegree"
                    rows={2}
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <FormField label="Medical School">
                <input
                  name="medicalSchool"
                  type="text"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Date of Board Certification">
                <input
                  name="boardCertDate"
                  type="date"
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

          {/* Special Interest */}
          <fieldset>
            <SectionHeader>Special Interest</SectionHeader>
            <FormField label="Special Interest">
              <textarea
                name="specialInterest"
                rows={2}
                className={textareaClass}
              />
            </FormField>
          </fieldset>

          {/* User Credentials */}
          <fieldset>
            <SectionHeader>User Credentials</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FormField label="Username" required>
                  <input name="username" type="text" className={inputClass} />
                </FormField>
              </div>

              <FormField label="Password" required>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Confirm Password" required>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </FormField>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-navy/10">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-3 rounded-lg bg-navy text-white text-sm font-semibold uppercase tracking-wide hover:bg-navy-dark transition-colors duration-300"
            >
              Register
            </button>
            <Link
              href="/membership/member-login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-3 rounded-lg border border-navy/15 text-navy text-sm font-semibold uppercase tracking-wide hover:bg-navy/[0.04] hover:border-navy/30 transition-all duration-300"
            >
              Log In
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
