import CouncilMemberImage from "@/components/the-college/CouncilMemberImage";
import type { CouncilMemberPublic } from "@/lib/types";

type CouncilMemberCardProps = Pick<
  CouncilMemberPublic,
  "id" | "name" | "position" | "email" | "imageUrl" | "placeholderUrl"
>;

export default function CouncilMemberCard({
  name,
  position,
  email,
  imageUrl,
  placeholderUrl,
}: CouncilMemberCardProps) {
  return (
    <article className="group rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
        <CouncilMemberImage
          name={name}
          position={position}
          imageUrl={imageUrl}
          placeholderUrl={placeholderUrl}
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-heading text-lg text-navy font-bold leading-snug">
          {name}
        </h3>
        {position && <p className="text-sm text-navy/60 mt-1">{position}</p>}
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
