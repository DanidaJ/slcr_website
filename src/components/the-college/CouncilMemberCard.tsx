import Image from "next/image";

type CouncilMemberCardProps = {
  name: string;
  role?: string;
  email?: string;
  image: string;
};

export default function CouncilMemberCard({
  name,
  role,
  email,
  image,
}: CouncilMemberCardProps) {
  return (
    <article className="group rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-heading text-lg text-navy font-bold leading-snug">
          {name}
        </h3>
        {role && <p className="text-sm text-navy/60 mt-1">{role}</p>}
        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block text-sm text-navy/50 hover:text-navy transition-colors"
          >
            {email}
          </a>
        )}
      </div>
    </article>
  );
}
