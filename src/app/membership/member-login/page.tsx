import type { Metadata } from "next";
import MemberLoginForm from "@/components/membership/MemberLoginForm";

export const metadata: Metadata = {
  title: "Member Login | Sri Lanka College of Radiologists",
  description:
    "Log in to your Sri Lanka College of Radiologists member account.",
};

export default async function MemberLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen bg-[#07102b] flex items-center justify-center relative overflow-hidden">
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

      {/* Form — padded top so it clears the fixed nav */}
      <div className="relative w-full max-w-md mx-auto px-5 sm:px-6 pt-24 pb-16">
        <MemberLoginForm errorCode={error} />
      </div>
    </main>
  );
}
