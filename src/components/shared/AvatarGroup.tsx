import { Person } from "../../types/task";

interface Props {
  people: Person[];
  max?: number;
  size?: "sm" | "md";
}

const COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-violet-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AvatarGroup({ people, max = 3, size = "sm" }: Props) {
  const visible = people.slice(0, max);
  const overflow = people.length - max;

  const px = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";

  return (
    <div className="flex -space-x-1.5">
      {visible.map((p, i) => (
        <div
          key={p.id}
          title={p.name}
          className={`${px} ${COLORS[i % COLORS.length]} rounded-full flex items-center justify-center
                      text-white font-medium ring-2 ring-white`}
        >
          {p.avatarUrl ? (
            <img
              src={p.avatarUrl}
              alt={p.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(p.name)
          )}
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={`${px} bg-gray-200 text-gray-600 rounded-full flex items-center justify-center
                      font-medium ring-2 ring-white`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
