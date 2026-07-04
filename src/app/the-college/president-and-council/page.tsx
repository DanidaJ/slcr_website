import PageHeader from "@/components/the-college/PageHeader";
import CouncilMemberCard from "@/components/the-college/CouncilMemberCard";
import { getCouncilMembers } from "@/lib/data/councilMembers";

const CURRENT_TERM = "2026-2027";

// /** Fetch council members on every request so DB edits appear without redeploying. */
// export const dynamic = "force-dynamic";

export default async function PresidentAndCouncilPage() {
  const members = await getCouncilMembers(CURRENT_TERM);

  return (
    <>
      <PageHeader title="President and Council" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10">
            <p className="text-navy/50 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Leadership
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-navy font-extrabold tracking-tight">
              Council Members 2026 - 2027
            </h2>
            <div className="mt-4 w-12 h-0.5 bg-gold" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {members.map((member) => (
              <CouncilMemberCard key={member.id} {...member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
