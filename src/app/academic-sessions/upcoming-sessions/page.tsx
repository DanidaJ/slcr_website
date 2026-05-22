import type { Metadata } from "next";
import {
  CalendarDays,
  MapPin,
  Clock,
  Download,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/the-college/PageHeader";
import sessionsData from "@/data/upcomingSessions.json";

type ScheduleItem = {
  time: string;
  title: string;
  speaker?: string;
  break?: boolean;
};

type ScheduleSession = {
  name: string | null;
  items: ScheduleItem[];
};

type WorkshopBlock = {
  type: "workshop";
  label: string;
  title: string;
  time: string;
  venue: string;
  resourcePersons: string[];
  note?: string;
};

type CeremonyBlock = {
  type: "ceremony";
  label: string;
  title: string;
  time: string;
  venue: string;
  highlight?: string;
  paragraphs: string[];
};

type ScheduleBlock = {
  type: "schedule";
  sessions: ScheduleSession[];
};

type Block = WorkshopBlock | CeremonyBlock | ScheduleBlock;

type ProgramDay = {
  date: string;
  venue: string;
  blocks: Block[];
};

type RegistrationRow = {
  category: string;
  currency: string;
  prices: string[];
};

type UpcomingSessions = {
  meta: {
    organization: string;
    title: string;
    subtitle: string;
    tagline: string;
    daysLabel: string;
    dateRange: string;
    venue: string;
    brochureUrl: string;
    registrationUrl: string;
  };
  program: ProgramDay[];
  registration: {
    note: string;
    columns: string[];
    rows: RegistrationRow[];
  };
  contact: {
    office: string;
    website: string;
  };
};

const data = sessionsData as unknown as UpcomingSessions;

export const metadata: Metadata = {
  title: `${data.meta.title} | Sri Lanka College of Radiologists`,
  description: `${data.meta.subtitle} — ${data.meta.tagline}. ${data.meta.dateRange}, ${data.meta.venue}.`,
};

function WorkshopCard({ block }: { block: WorkshopBlock }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-6 sm:p-8 shadow-sm">
      <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        {block.label}
      </span>
      <h4 className="mt-2 font-heading text-xl sm:text-2xl text-navy font-extrabold">
        {block.title}
      </h4>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy/70">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gold" />
          {block.time}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-gold" />
          {block.venue}
        </span>
      </div>

      <div className="mt-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-navy/50">
          <Users className="w-4 h-4" />
          Resource Persons
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {block.resourcePersons.map((person) => (
            <span
              key={person}
              className="rounded-full bg-surface border border-navy/10 px-3 py-1 text-sm text-navy/80"
            >
              {person}
            </span>
          ))}
        </div>
      </div>

      {block.note && (
        <p className="mt-4 text-sm italic text-navy/50">{block.note}</p>
      )}
    </div>
  );
}

function CeremonyCard({ block }: { block: CeremonyBlock }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-navy p-6 sm:p-8 shadow-sm text-white">
      <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        {block.label}
      </span>
      <h4 className="mt-2 font-heading text-xl sm:text-2xl font-extrabold">
        {block.title}
      </h4>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gold" />
          {block.time}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-gold" />
          {block.venue}
        </span>
      </div>

      {block.highlight && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy-light/50 border border-white/10 px-4 py-2.5">
          <Award className="w-4 h-4 text-gold" />
          <span className="text-sm font-semibold">{block.highlight}</span>
        </div>
      )}

      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-white/75">
        {block.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function ScheduleCard({ block }: { block: ScheduleBlock }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white shadow-sm overflow-hidden">
      {block.sessions.map((session, sessionIndex) => (
        <div key={sessionIndex}>
          {session.name && (
            <div className="bg-surface border-y border-navy/10 px-5 sm:px-7 py-3">
              <h4 className="font-heading text-base sm:text-lg text-navy font-bold">
                {session.name}
              </h4>
            </div>
          )}
          <div className="divide-y divide-navy/[0.06]">
            {session.items.map((item, itemIndex) =>
              item.break ? (
                <div
                  key={itemIndex}
                  className="px-5 sm:px-7 py-2.5 bg-navy/[0.02] text-center"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy/45">
                    {item.title} · {item.time}
                  </span>
                </div>
              ) : (
                <div
                  key={itemIndex}
                  className="px-5 sm:px-7 py-4 grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1 sm:gap-5"
                >
                  <span className="text-sm font-semibold text-gold sm:text-navy/70 sm:font-medium whitespace-nowrap">
                    {item.time}
                  </span>
                  <div>
                    <p className="text-[15px] text-navy font-medium leading-snug">
                      {item.title}
                    </p>
                    {item.speaker && (
                      <p className="mt-1 text-sm text-navy/55">{item.speaker}</p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DayBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "workshop") {
          return <WorkshopCard key={index} block={block} />;
        }
        if (block.type === "ceremony") {
          return <CeremonyCard key={index} block={block} />;
        }
        return <ScheduleCard key={index} block={block} />;
      })}
    </div>
  );
}

export default function UpcomingSessionsPage() {
  const { meta, program, registration, contact } = data;

  return (
    <>
      <PageHeader
        title={meta.title}
        eyebrow="Academic Sessions"
        subtitle={`${meta.subtitle} · ${meta.tagline}`}
        tone="dark"
      />

      {/* Event meta band */}
      <section className="bg-navy-dark border-t border-navy-light/40">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-white/85">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-gold" />
                <span className="text-sm sm:text-base">
                  {meta.daysLabel}, {meta.dateRange}
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <span className="text-sm sm:text-base">{meta.venue}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/academic-sessions/registration"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gold text-navy rounded-lg hover:bg-gold-light transition-colors"
              >
                Register Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={meta.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white border border-white/30 rounded-lg hover:border-white/60 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Program */}
      <section className="py-14 sm:py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 space-y-12">
          {program.map((day) => (
            <div key={day.date}>
              <div className="mb-6">
                <h2 className="font-heading text-2xl sm:text-3xl text-navy font-extrabold tracking-tight">
                  {day.date}
                </h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-navy/55">
                  <MapPin className="w-4 h-4 text-gold" />
                  {day.venue}
                </p>
                <div className="mt-3 w-12 h-0.5 bg-gold" />
              </div>
              <DayBlocks blocks={day.blocks} />
            </div>
          ))}
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-14 sm:py-16 bg-white border-t border-navy/10">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-2">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-navy/50">
              Registration
            </p>
            <p className="mt-1 text-sm text-navy/60">{registration.note}</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="/academic-sessions/registration"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gold text-navy rounded-lg hover:bg-gold-light transition-colors"
            >
              Register Now
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-sm text-navy/55">
              Queries? Contact the College office at{" "}
              <a
                href={`mailto:${contact.office}`}
                className="text-navy font-medium hover:text-gold transition-colors"
              >
                {contact.office}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Brochure download */}
      <section className="py-12 sm:py-14 bg-navy">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="font-heading text-xl sm:text-2xl text-white font-extrabold">
                Full Brochure
              </h3>
              <p className="mt-1.5 text-sm text-white/65">
                Download the complete {meta.title} brochure for the full
                programme and details.
              </p>
            </div>
            <a
              href={meta.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gold text-navy rounded-lg hover:bg-gold-light transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
