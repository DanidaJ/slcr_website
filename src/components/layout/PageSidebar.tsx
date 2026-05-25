"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Search } from "lucide-react";

type SidebarStory = {
  title: string;
  date: string;
  image: string;
  href: string;
};

const TOP_STORIES: SidebarStory[] = [
  {
    title: "Annual Academic Sessions - 2024",
    date: "2024-02-18",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title: "1st Academic workshop for 2022",
    date: "2022-06-09",
    image:
      "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title: "International Day of Radiology - 2022",
    date: "2022-11-04",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title: "Neuro Imaging - Annual Academic Sessions 2023",
    date: "2023-01-14",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title: "Pre-congress workshop - Neuro intervention",
    date: "2023-01-14",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
];

const NEWS_EVENTS: SidebarStory[] = [
  {
    title: "24th Annual Academic Sessions of Sri Lanka College of Radiologists - 2025",
    date: "2025-08-06",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title:
      "Request to list 2026 Global MSK MRI & Ultrasound Mini Fellowship Course",
    date: "2025-08-06",
    image:
      "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title: "24th Annual Academic Sessions – October 2025",
    date: "2025-07-22",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title: "Criteria for Awarding the memorial Medals and cash prizes",
    date: "2025-06-30",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
  {
    title: "Annual Academic Sessions 2025",
    date: "2025-06-30",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&h=120&fit=crop&auto=format&q=80",
    href: "#",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StoryList({ stories }: { stories: SidebarStory[] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {stories.map((story) => (
        <li key={story.title}>
          <Link
            href={story.href}
            className="group flex gap-3 py-3.5 hover:bg-surface/80 transition-colors"
          >
            <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-gray-100">
              <Image
                src={story.image}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-sm font-bold text-navy group-hover:text-navy/70 transition-colors leading-snug line-clamp-2">
                {story.title}
              </h3>
              <p className="mt-1.5 text-gray-400 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3 shrink-0" />
                {formatDate(story.date)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function PageSidebar() {
  const [activeTab, setActiveTab] = useState<"stories" | "news">("stories");

  return (
    <aside className="space-y-6">
      <div className="relative">
        <label htmlFor="page-search" className="sr-only">
          Search
        </label>
        <input
          id="page-search"
          type="search"
          placeholder="SEARCH HERE"
          className="w-full rounded border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy/30 uppercase tracking-wide"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40 pointer-events-none" />
      </div>

      <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab("stories")}
            className={`px-3 py-2.5 text-[10px] sm:text-xs font-semibold tracking-wide uppercase transition-colors ${
              activeTab === "stories"
                ? "bg-navy text-white"
                : "bg-gray-100 text-navy/60 hover:text-navy"
            }`}
          >
            Top Stories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("news")}
            className={`px-3 py-2.5 text-[10px] sm:text-xs font-semibold tracking-wide uppercase transition-colors ${
              activeTab === "news"
                ? "bg-navy text-white"
                : "bg-gray-100 text-navy/60 hover:text-navy"
            }`}
          >
            News &amp; Events
          </button>
        </div>
        <div className="px-3">
          {activeTab === "stories" ? (
            <StoryList stories={TOP_STORIES} />
          ) : (
            <StoryList stories={NEWS_EVENTS} />
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Sri Lanka College of Radiologists"
            width={48}
            height={48}
            className="rounded-full object-contain"
          />
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold text-navy leading-tight">
              Sri Lanka College of Radiologists
            </p>
            <p className="text-xs text-navy/50 mt-0.5">Follow us on Facebook</p>
          </div>
        </div>
        <a
          href="https://www.facebook.com/SriLankaCollegeofRadiologists"
          target="_blank"
          rel="noreferrer"
          className="mt-4 block w-full text-center py-2 rounded bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#166FE5] transition-colors"
        >
          Follow Page
        </a>
      </div>
    </aside>
  );
}
