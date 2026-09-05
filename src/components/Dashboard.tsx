 // src/components/Dashboard.tsx

import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceProvider";
import { useProject } from "../context/ProjectProvider";
import { useTask } from "../context/TaskProvider";
import { useAuth } from "../hooks/useAuth";
import type { Task, TaskStatus } from "../types/task";
import { ActivityPanel } from '../components/ActivityPanel';
import { useMember } from "@/context/MemberProvider";

/* ───────────────────────────── helpers ───────────────────────────── */

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-400",
  low: "bg-blue-400",
};

const STATUS_BADGE: Record<
  TaskStatus,
  { label: string; bg: string; text: string }
> = {
  todo: { label: "To Do", bg: "bg-gray-100", text: "text-gray-600" },
  in_progress: {
    label: "In Progress",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  done: { label: "Done", bg: "bg-green-50", text: "text-green-700" },
  overdue: { label: "Overdue", bg: "bg-red-50", text: "text-red-700" },
};

/* ─────────────────────────── sub-components ──────────────────────── */

function StatCard({
  icon,
  label,
  count,
  accent,
  percentage,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  accent: string;
  percentage: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-lg ${accent}`}>{icon}</div>
        {percentage > 0 && (
          <span className="text-xs font-medium text-gray-400">
            {percentage}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

/* Overlapping avatar stack */
function AvatarStack({ members, max = 3 }: { members: { name: string; avatar?: string }[]; max?: number }) {
  if (!members || members.length === 0) return null;

  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((member, i) => (
        <div
          key={i}
          title={member.name}
          className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
          style={{
            backgroundColor: nameToColor(member.name),
            zIndex: visible.length - i,
          }}
        >
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            initials(member.name)
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600 shrink-0"
          style={{ zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

/* Generate consistent color from name */
function nameToColor(name: string): string {
  const colors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
    "#f97316", "#eab308", "#22c55e", "#14b8a6",
    "#06b6d4", "#3b82f6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/* Get initials from name */
function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}


function TaskDistributionBar({
  counts,
  total,
}: {
  counts: Record<TaskStatus, number>;
  total: number;
}) {
  if (total === 0) return null;

  const segments: { key: TaskStatus; color: string; label: string }[] = [
    { key: "done", color: "bg-green-500", label: "Done" },
    { key: "in_progress", color: "bg-blue-500", label: "In Progress" },
    { key: "todo", color: "bg-gray-400", label: "To Do" },
    { key: "overdue", color: "bg-red-500", label: "Overdue" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Task Distribution
      </h3>

      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
        {segments.map((seg) => {
          const pct = (counts[seg.key] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={seg.key}
              className={`${seg.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${counts[seg.key]}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
            {seg.label}{" "}
            <span className="font-medium text-gray-700">
              {counts[seg.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTaskRow({ task }: { task: Task }) {

  const badge = STATUS_BADGE[task.status] ?? STATUS_BADGE.todo;
  const dot = PRIORITY_DOT[(task as any).priority] ?? "bg-gray-300";

  const avatarMembers = task.assignees.map((a) => ({
    name: a.name,
    avatar: a.avatarUrl ?? undefined
   }));


  return (
    <li className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 group">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
            {task.name}
          </p>
          {task.description && (
            <p className="text-xs text-gray-400 truncate max-w-xs">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-3">
        {/* ← Overlapping avatars */}
        <AvatarStack members={avatarMembers} max={3} />

        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
        <span className="text-xs text-gray-400 w-16 text-right">
          {relativeTime(task.updated_at)}
        </span>
      </div>
     
    </li>
  );
}

//********************************************************** */
function ProjectCard({
  project,
  tasks,
  workspaceId,
  onSelect,
}: {
  project: { id: number; name: string; description?: string };
  tasks: Task[];
  workspaceId: number;
  onSelect: ()=> void;
}) {
  const projectTasks = tasks.filter((t) => t.project_id === project.id);
  const done = projectTasks.filter((t) => t.status === "done").length;
  const total = projectTasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link
      to={`/workspace/${workspaceId}/project/${project.id}/board`}
      onClick={onSelect}

      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-indigo-200 transition-all group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
            {project.name}
          </h4>
          {project.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {project.description}
            </p>
          )}
        </div>
        <span className="text-xs font-medium text-gray-400 shrink-0 ml-2">
          {total} tasks
        </span>
      </div>

      {/* Mini progress bar */}
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>{done} completed</span>
        <span>{pct}%</span>
      </div>
    </Link>
  );
}

/* ───────────────────────────── icons ─────────────────────────────── */

const IconTasks = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconTodo = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" />
  </svg>
);

const IconProgress = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const IconDone = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconOverdue = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const IconProjects = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
);

/* ────────────────────────── main component ───────────────────────── */

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { getCurrentWorkspaceTasks,getWorkspaceTasks, fetchTasks, tasks, loading} = useTask();
  const { projects, setCurrentProject } = useProject();
  const normalize = (s: string) => s.toLowerCase() as TaskStatus;

  if (!currentWorkspace) return null;

  const wsTasks = getWorkspaceTasks(currentWorkspace.id);
  
   const dashboardGrouped = wsTasks.reduce((acc, task) => {
      const key = normalize(task.status);

      if (!acc[key]) acc[key] = [];
         acc[key].push(task);
      return acc;
  }, {} as Record<TaskStatus, Task[]>);

  useEffect(() => {
    setCurrentProject(null);
  }, []);

  const counts = {
    todo: dashboardGrouped["todo"]?.length ?? 0,
    in_progress: dashboardGrouped["in_progress"]?.length ?? 0,
    done: dashboardGrouped["done"]?.length ?? 0,
    overdue: dashboardGrouped["overdue"]?.length ?? 0,
  };

  const total = wsTasks.length;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 7);

  const userName =
    (user as any)?.name ??
    (user as any)?.email?.split("@")[0] ??
    "";

    

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6 ml-0">
      {/* ── Header ── */}
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {greeting()}
          {userName ? `, ${userName.charAt(0).toUpperCase() + userName.slice(1)}` : ""} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentWorkspace
            ? `Here's what's happening in ${currentWorkspace.name}`
            : "Select a workspace to get started"}
        </p>
      </header>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<IconTasks />}
          label="Total Tasks"
          count={total}
          accent="bg-indigo-50 text-indigo-600"
          percentage={0}
        />
        <StatCard
          icon={<IconTodo />}
          label="To Do"
          count={counts.todo}
          accent="bg-gray-100 text-gray-600"
          percentage={pct(counts.todo)}
        />
        <StatCard
          icon={<IconProgress />}
          label="In Progress"
          count={counts.in_progress}
          accent="bg-blue-50 text-blue-600"
          percentage={pct(counts.in_progress)}
        />
        <StatCard
          icon={<IconDone />}
          label="Done"
          count={counts.done}
          accent="bg-green-50 text-green-600"
          percentage={pct(counts.done)}
        />
        <StatCard
          icon={<IconOverdue />}
          label="Overdue"
          count={counts.overdue}
          accent="bg-red-50 text-red-600"
          percentage={pct(counts.overdue)}
        />
      </div>

      {/* ── Task Distribution Bar ── */}
      <TaskDistributionBar counts={counts} total={total} />

      {/* ── Two-column layout: Recent Tasks + Projects ── */}
      <div className="grid grid-cols-1 md:grid-cols-2   gap-8">

        {/* Projects Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <IconProjects />
              </span>
              Projects
            </h2>
            <span className="text-xs text-gray-400">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">No projects yet</p>
              <p className="text-xs text-gray-300 mt-1">
                Create a project to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:pr-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={tasks}
                  workspaceId={currentWorkspace?.id ?? 0}
                  onSelect={() => setCurrentProject(project)}
                />
              ))}
            </div>
          )}
          
        </div>    
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8  ">
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">

              {/* Icon */}
              <span className="p-1.5 rounded-lg bg-emerald-50 text-green-600">
                <IconTasks />
              </span>

              {/* All text in ONE inline span */}
              <span className="flex items-center gap-1">
                Recent
                <span className="text-green-600">
                  task{wsTasks.length !== 1 ? "s" : ""}
                </span>
                Activity
                <span className="text-gray-500">
                  ({wsTasks.length})
                </span>
              </span>

            </h2>
          </div>
            
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : wsTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">No tasks yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Create a task to see activity here
              </p>
            </div>
          ) : (
            <ul>
              {wsTasks.map((task) => (
                <RecentTaskRow key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>
           
      </div>
    </div>
  );
};

export default Dashboard;


 
