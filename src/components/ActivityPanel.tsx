import React, { useState } from "react";
import { useActivity } from "../context/ActivityProvider";

// ⭐ Unified icon + color function
function getActivityStyle(description: string) {
  const text = description.toLowerCase();

  if (text.includes("removed member"))
    return { icon: IconRemoveMember, color: "text-red-600" };

  if (text.includes("invited member"))
    return { icon: IconInviteMember, color: "text-blue-600" };

  if (text.includes("created task"))
    return { icon: IconCreateTask, color: "text-green-600" };

  if (text.includes("updated task"))
    return { icon: IconUpdateTask, color: "text-yellow-600" };

  if (text.includes("deleted task"))
    return { icon: IconDeleteTask, color: "text-red-600" };

  if (text.includes("status"))
    return { icon: IconStatusChange, color: "text-purple-600" };

  return { icon: IconDefault, color: "text-gray-600" };
}

function groupByDay(items: any[]) {
  const groups: Record<string, any[]> = {};

  items.forEach((item) => {
    const date = new Date(item.created_at);
    const dayKey = date.toLocaleDateString(); // e.g., "7/3/2026"

    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(item);
  });

  return groups;
}

// ⭐ SVG ICONS
const IconRemoveMember = (
  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2"
       viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconInviteMember = (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2"
       viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 4v16m8-8H4" />
  </svg>
);

const IconCreateTask = (
  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2"
       viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M5 13l4 4L19 7" />
  </svg>
);

const IconUpdateTask = (
  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2"
       viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 4v6h6M20 20v-6h-6M4 20l6-6M20 4l-6 6" />
  </svg>
);

const IconDeleteTask = (
  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2"
       viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 7l-1 12H6L5 7m5 4v6m4-6v6M9 7h6m-7 0l1-3h8l1 3" />
  </svg>
);

const IconStatusChange = (
  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2"
       viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 4v6h6M20 20v-6h-6M4 20l6-6M20 4l-6 6" />
  </svg>
);

const IconDefault = (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2"
       viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" />
  </svg>
);


export function ActivityPanel() {
  const {
    currentActivity,
    weeklySummary,
    fullActivity,
    loading,
    error,
    fetchActivity,
  } = useActivity();

  function toggleDay(day: string) {
  setCollapsedDays(prev => ({
    ...prev,
    [day]: !prev[day]
  }));
}
  
  const [showAll, setShowAll] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});

  const activeMembers = weeklySummary.filter(
    (m) =>
      m.tasksCompleted > 0 ||
      m.tasksAssigned > 0 ||
      m.comments > 0 ||
      m.statusChanges > 0
  );

  const VISIBLE_COUNT = 10;
  
  const visibleFullActivity = showAll
    ? fullActivity
    : fullActivity.slice(0, VISIBLE_COUNT);

  const groupedFullActivity = groupByDay(visibleFullActivity);
  

  return (
    <div className="w-full flex justify-center">
      <aside className="w-full min-w-88 max-w-xlg bg-gray-50 flex flex-col shrink-0">

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-1 py-1 space-y-8">

          {/* CURRENT ACTIVITY */}
          <section>
            <h3 className="font-semibold text-gray-500 mb-3">
              Current Activity
            </h3>

            {loading && (
              <p className="text-xs text-gray-400">Loading activity…</p>
            )}

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            {currentActivity.length === 0 ? (
              <p className="text-xs text-gray-400">No recent actions.</p>
            ) : (
              <ul className="space-y-1">
                {currentActivity.map((item) => {
                  const { icon, color } = getActivityStyle(item.description);

                  return (
                    <li
                      key={item.id}
                      className="flex items-start gap-2 text-sm leading-relaxed font-semibold"
                    >
                      <span className="mt-0.5 text-gray-400">{icon}</span>

                      <div className="wrap-break-words whitespace-normal">
                        <span className={color}>{item.description}</span>

                        <div className="text-[10px] text-gray-400">
                          {item.relativeTime}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* WEEKLY SUMMARY */}
          <section>
            <h3 className="font-semibold text-gray-500 mb-2">
              Last 7 Days Activity
            </h3>

            {activeMembers.length === 0 ? (
              <p className="text-xs text-gray-400">No activity this week.</p>
            ) : (
              <ul className="space-y-3">
                {activeMembers.map((m) => (
                  <li
                    key={m.memberId}
                    className="border border-gray-100 rounded-md px-3 py-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-800">
                        {m.memberName}
                      </span>
                    </div>

                    <div className="flex flex-wrap font-semibold gap-x-3 gap-y-1 text-[11px] text-gray-600 wrap-break-words whitespace-normal">
                      <span>📁 {m.projectsCreated} projects created</span>
                      <span>🗑️ {m.projectsDeleted} projects deleted</span>
                      <span>✅ {m.tasksCompleted} completed</span>
                      <span>📌 {m.tasksAssigned} assigned</span>
                      <span>💬 {m.comments} comments</span>
                      <span>🔁 {m.statusChanges} status changes</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

         {/* FULL ACTIVITY FEED */}
    {/* FULL ACTIVITY FEED */}
    <section>
      <h3 className="font-semibold text-gray-500 mb-2">
        Full Activity Feed
      </h3>

      {loading && (
        <p className="text-sm text-gray-400">Loading full activity…</p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {fullActivity.length === 0 ? (
        <p className="text-sm text-gray-400">No activity found.</p>
      ) : (
        <>
          {/* GROUPED BY DAY */}
          {Object.entries(groupedFullActivity).map(([day, items]) => {
            const isCollapsed = collapsedDays[day] ?? false;

            return (
              <div key={day} className="mb-2">

                {/* ⭐ Sticky Day Header + Collapse Toggle */}
                <div
                  className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 sticky top-0 cursor-pointer flex justify-between items-center border-b border-gray-200"
                  onClick={() => toggleDay(day)}
                >
                  <span>{day}</span>
                  <span className="text-gray-500 text-xs">
                    {isCollapsed ? "▼" : "▲"}
                  </span>
                </div>

                {/* ⭐ Collapsible Day Items */}
                {!isCollapsed && (
                  <ul className="space-y-1 mt-1">
                    {items.map((item) => {
                      const { icon, color } = getActivityStyle(item.description);

                      return (
                        <li
                          key={item.id}
                          className="flex items-start gap-2 text-sm leading-relaxed font-semibold"
                        >
                          <span className="mt-0.5 text-gray-400">{icon}</span>

                          <div className="wrap-break-words whitespace-normal">
                            <span className={color}>{item.description}</span>

                            <div className="text-[10px] text-gray-400">
                              {new Date(item.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}

          {/* MORE BUTTON */}
          {!showAll && fullActivity.length > VISIBLE_COUNT && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs text-blue-600 hover:underline mt-2"
            >
              more...
            </button>
          )}

          {/* SHOW LESS BUTTON */}
          {showAll && fullActivity.length > VISIBLE_COUNT && (
            <button
              onClick={() => setShowAll(false)}
              className="text-xs text-blue-600 hover:underline mt-2"
            >
              show less
            </button>
          )}
        </>
      )}
    </section>



        </div>
      </aside>
    </div>
  );
}
