"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { fadeUp } from "@/lib/motion";
import CustomSelect from "@/components/ui/CustomSelect";
import RadioGroup from "@/components/ui/RadioGroup";
import DatePicker from "@/components/ui/DatePicker";

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
      <label className="block text-sm font-medium text-white/80 mb-1.5">
        {label}
        {required && <span className="text-gold ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all backdrop-blur-sm";

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

export default function RegisterForm() {
  const [salutation, setSalutation] = useState("");
  const [province, setProvince] = useState("");
  const [post, setPost] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  return (
    <motion.div
      variants={fadeUp()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {/* Header card */}
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

      {/* Form body */}
      <div className="rounded-b-2xl bg-navy-dark border border-t-0 border-navy-light/20 px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
        <form className="space-y-10">
          {/* Personal Information */}
          <fieldset>
            <SectionLegend>Personal Information</SectionLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Salutation" required>
                <CustomSelect
                  name="salutation"
                  options={SALUTATIONS}
                  value={salutation}
                  onChange={setSalutation}
                />
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
                <DatePicker name="dob" value={dob} onChange={setDob} />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Gender" required>
                  <RadioGroup
                    name="gender"
                    options={["Male", "Female"]}
                    value={gender}
                    onChange={setGender}
                  />
                </FormField>
              </div>
            </div>
          </fieldset>

          <div className="h-px bg-white/[0.06]" />

          {/* Contact Information */}
          <fieldset>
            <SectionLegend>Contact Information</SectionLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                <CustomSelect
                  name="province"
                  options={PROVINCES}
                  value={province}
                  onChange={setProvince}
                />
              </FormField>

              <FormField label="Hospital / Institute">
                <input name="hospital" type="text" className={inputClass} />
              </FormField>

              <FormField label="Post" required>
                <CustomSelect
                  name="post"
                  options={POSTS}
                  value={post}
                  onChange={setPost}
                />
              </FormField>

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

              <FormField label="Preferred Contact Number" required>
                <input
                  name="preferredContact"
                  type="tel"
                  className={inputClass}
                />
              </FormField>
            </div>
          </fieldset>

          <div className="h-px bg-white/[0.06]" />

          {/* Professional Qualification */}
          <fieldset>
            <SectionLegend>Professional Qualification</SectionLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

          {/* Special Interest */}
          <fieldset>
            <SectionLegend>Special Interest</SectionLegend>
            <FormField label="Special Interest">
              <textarea
                name="specialInterest"
                rows={2}
                className={textareaClass}
              />
            </FormField>
          </fieldset>

          <div className="h-px bg-white/[0.06]" />

          {/* User Credentials */}
          <fieldset>
            <SectionLegend>User Credentials</SectionLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-3.5 rounded-xl bg-gold text-navy text-sm font-bold uppercase tracking-wide hover:bg-gold-light transition-colors duration-300"
            >
              Register
            </button>
            <Link
              href="/membership/member-login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-3.5 rounded-xl border border-white/15 text-white/80 text-sm font-semibold uppercase tracking-wide hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300"
            >
              Log In
            </Link>
          </div>

          <p className="text-center text-sm text-white/40">
            Already a member?{" "}
            <Link
              href="/membership/member-login"
              className="font-semibold text-gold hover:text-gold-light transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
}
