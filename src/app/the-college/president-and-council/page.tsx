import PageHeader from "@/components/the-college/PageHeader";
import CouncilMemberCard from "@/components/the-college/CouncilMemberCard";

const PLACEHOLDER_IMAGE = "/images/Profile-Placeholder.png";

const COUNCIL_MEMBERS = [
  {
    name: "Dr Nayana Samarasinghe",
    role: "The President",
    image: "/images/president.png",
  },
  {
    name: "Dr Udaya Wanigasiri",
    role: "President Elect",
    email: "wanigasiri@yahoo.com",
    image: "/images/Dr_udaya_wanigasiri.jpg",
  },
  {
    name: "Dr Geethika Perera",
    role: "Hon. Secretary",
    image: "/images/Dr-Geethika-Perera.jpg",
  },
  {
    name: "Dr Eranga Ganewatte",
    role: "Ass. Secretary (Academic)",
    email: "erangaganewatte@ymail.com",
    image: "/images/Dr.-Eranga-Ganewatte.jpg",
  },
  {
    name: "Dr Uditha Kodithuwakku",
    role: "Ass. Secretary (Social)",
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: "Dr Wasantha Sathkorala",
    role: "Hon. Treasurer",
    email: "wasanthawk@yahoo.com",
    image: "/images/wasantha_sathkorala1.jpg",
  },
  {
    name: "Dr W Meegoda",
    role: "Asst. Treasurer",
    email: "wmeegoda@gmail.com",
    image: "/images/w_meegoda.jpg",
  },
  {
    name: "Dr Sheahan Waas",
    role: "Immediate Past President",
    image: "/images/Dr-Sheahan-Waas.jpg",
  },
  {
    name: "Dr Sumedha Kumanayake",
    email: "sumedha_kumanayake@yahoo.com",
    image: "/images/Dr.-Sumedha-Kumanayake.jpg",
  },
  {
    name: "Dr R K J S Rajapakse",
    email: "sathrajapakse@yahoo.com",
    image: "/images/Dr.-Janaka-Rajapakse.jpg",
  },
  {
    name: "Dr Udaya Jayakodi",
    email: "udaya.jayakody@gmail.com",
    image: "/images/Dr.-Udaya-Jayakody.jpg",
  },
  {
    name: "Dr K M R Kannangara",
    email: "rupakannangara@ymail.com",
    image: "/images/Dr.-Rupa-Kannangara.jpg",
  },
  {
    name: "Dr Pavithra Rubasinghe",
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: "Dr Amali Saratchandra",
    image: "/images/Dr-Amali-Saratchandra.jpg",
  },
  {
    name: "Dr Buddhi Abeywickrama",
    image: PLACEHOLDER_IMAGE,
  },
  {
    name: "Dr M C Wettasinghe",
    image: "/images/DR-m-c-wettasinghe.jpg",
  },
  {
    name: "Dr Sashika Alahakoon",
    image: "/images/Dr-Sashika-Alahakoon.jpg",
  },
  {
    name: "Dr Anton Jenil",
    image: PLACEHOLDER_IMAGE,
  },
];

export default function PresidentAndCouncilPage() {
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
            {COUNCIL_MEMBERS.map((member) => (
              <CouncilMemberCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
