import Image from "next/image";
import PageHeader from "@/components/the-college/PageHeader";

const PLACEHOLDER_IMAGE = "/images/Profile-Placeholder.png";

const PAST_PRESIDENTS = [
  {
    name: "Dr. S.N.B.Talwatte",
    image: "/images/past-presidents/Dr.-S.N.B.Talwatte.jpg",
  },
  {
    name: "Dr. A.W.Atukorale",
    image: "/images/past-presidents/Dr.-A.W.Atukorale.jpg",
  },
  {
    name: "Dr. K.M.C.De Silva",
    image: "/images/past-presidents/Dr.-K.M.C.De-Silva.jpg",
  },
  {
    name: "Dr. (Mrs) P.Amarasinghe",
    image: "/images/past-presidents/Dr.-Mrs-P.Amarasinghe-1.jpg",
  },
  {
    name: "Dr. N.Jayaratne",
    image: "/images/past-presidents/Dr.-N.Jayaratne.jpg",
  },
  {
    name: "Dr. D.D.A Jayamanne",
    image: "/images/past-presidents/Dr.-D.D.A-Jayamanne.jpg",
  },
  {
    name: "Dr. (Mrs) U. Weerasinghe",
    image: "/images/past-presidents/Dr.-Mrs-U.Weerasinghe-1.jpg",
  },
  {
    name: "Dr. Thureirajah",
    term: "1999 – 2000",
    image: "/images/past-presidents/Dr.-Thureirajah.jpg",
  },
  {
    name: "Dr. (Mrs) G.Subasinghe",
    term: "2000 – 2002",
    image: "/images/past-presidents/Dr.-Mrs-G.Subasinghe.jpg",
  },
  {
    name: "Dr. (Mrs.) I. N. A. Gunarathne",
    term: "2002 – 2003",
    image: "/images/past-presidents/Dr.-Mrs.-I.-N.-A.-Gunarathne.jpg",
  },
  {
    name: "Dr. (Mrs) K.Pathirane",
    term: "2003 – 2004",
    image: "/images/past-presidents/Dr.-Mrs-K.Pathirane.jpg",
  },
  {
    name: "Dr. (Mrs.) N. Somaweera",
    term: "2004 - 2005",
    image: "/images/past-presidents/Dr.-Mrs.-N.-Somaweera.jpg",
  },
  {
    name: "Dr. S. V. Alahakoon",
    term: "2005 – 2006",
    image: "/images/past-presidents/Dr.-S.-V.-Alahakoon.jpg",
  },
  {
    name: "Dr. N.G. Atulugama",
    term: "2006 – 2007",
  },
  {
    name: "Dr. I. N. Lekamge",
    term: "2007 - 2008",
    image: "/images/past-presidents/Dr.-I.-N.-LEKAMGE.jpg",
  },
  {
    name: "Dr. P.B. Hewavithana",
    term: "2008 - 2009",
    image: "/images/past-presidents/Dr.P.B.Hewavithana.jpg",
  },
  {
    name: "Dr (Mrs) Rajapaksha",
    term: "2009 – 2010",
    image: "/images/past-presidents/Dr-Mrs-T.G.T.Rajapaksha.jpg",
  },
  {
    name: "Dr. U Samarasinghe",
    term: "2010 – 2011",
    image: "/images/past-presidents/Dr.-Usaha-Samarasinghe.jpg",
  },
  {
    name: "Maj. Gen. (Dr) S.H.Munasinghe",
    term: "2011 – 2012",
    image: "/images/past-presidents/Dr.-S.H.-Munasinghe-.jpg",
  },
  {
    name: "Brig. (Dr ) D.T.N. Munasinghe",
    term: "2012 – 2013",
    image: "/images/past-presidents/Brig.-Dr-D.T.N.Munasinghe.jpg",
  },
  {
    name: "Dr. K. Samarawickrama",
    term: "2013 – 2014",
    image: "/images/past-presidents/Dr.K.Samarawickrama.jpg",
  },
  {
    name: "Dr. Chandra Sirigampala",
    term: "2014 - 2015",
    image: "/images/past-presidents/Dr.-Chandra-Sirigampala-1.jpg",
  },
  {
    name: "Dr. Wickramarathna",
    term: "2015 – 2016",
    image: "/images/past-presidents/Dr.-D.J.-Wickramarathna.jpg",
  },
  {
    name: "Dr. Shanthini Rosairo",
    term: "2016 – 2017",
    image: "/images/past-presidents/Dr-Shanthini-Rosairo.jpg",
  },
  {
    name: "Dr. A.S Pallewatte",
    term: "2017 - 2018",
    image: "/images/past-presidents/DrASPallewatte.jpg",
  },
  {
    name: "Dr. Prasad De Silva",
    term: "2018 - 2019",
    image: "/images/past-presidents/Dr.-Prasad-De-Silva-1-768x1024-1.jpg",
  },
  {
    name: "Dr. Pandula Hettiarachchi",
    term: "2019 - 2020",
    image: "/images/past-presidents/Dr-Pandula-Hettiarachchi_pp.jpg",
  },
  {
    name: "Dr. Jerrard Fernando",
    term: "2019 - 2020",
    image: "/images/past-presidents/dr_jerrad_fernando.jpg",
  },
  {
    name: "Dr. W. A. Dileep Karunaratne",
    term: "2022 - 2023",
    image: "/images/dr_wa_dileep_karunaratne-1-150x150.jpg",
  },
  {
    name: "Dr Shantha Hettiarachchi",
    term: "2023 - 2024",
    image: "/images/past-presidents/shantha_hettiarachchi.jpg",
  },
  {
    name: "Prof Harsha Dissanayake",
    term: "2024 - 2025",
    image: "/images/past-presidents/prof_harsha_dissanayake.jpg",
  },
  {
    name: "Dr Sheahan Waas",
    term: "2025 - 2026",
    image: "/images/past-presidents/Dr-Sheahan-Waas.jpg",
  },
];

export default function PastPresidentsPage() {
  return (
    <>
      <PageHeader title="Past Presidents" />
      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {PAST_PRESIDENTS.map((president, index) => (
              <article
                key={`${president.name}-${index}`}
                className="group rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
                  <Image
                    src={president.image ?? PLACEHOLDER_IMAGE}
                    alt={president.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 sm:p-5 text-center">
                  <h3 className="font-heading text-lg text-navy font-bold leading-snug">
                    {president.name}
                  </h3>
                  {president.term && (
                    <p className="text-sm text-navy/60 mt-1">
                      {president.term}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
