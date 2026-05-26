import type { Metadata } from "next";
import RegisterForm from "@/components/membership/RegisterForm";

export const metadata: Metadata = {
  title: "Register | Sri Lanka College of Radiologists",
  description:
    "Register as a member of the Sri Lanka College of Radiologists.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#07102b] relative overflow-hidden">
      {/* Ambient glow layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gold/[0.06] blur-[130px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-blue-500/[0.07] blur-[110px]" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-indigo-600/[0.08] blur-[110px]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-20">
        <RegisterForm />
      </div>
    </main>
  );
}
