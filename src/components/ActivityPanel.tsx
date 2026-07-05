// src/components/activity/ActivityPanel.tsx
import React, {useState} from "react";
import { useActivity } from "../context/ActivityProvider";

export function ActivityPanel() {
 
 const {
  currentActivity,
  weeklySummary,
  fullActivity,   
  loading,
  error,
  fetchActivity,
} = useActivity();
  console.log("current activity : ", currentActivity)
  const [showAll, setShowAll] = useState(false);

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



  return (
   <div className="w-full flex justify-center">
    <aside className="w-full  min-w-88 max-w-xlg   bg-gray-50 flex flex-col shrink-0">
      

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-8">

        {/* CURRENT ACTIVITY */}
        <section>
          <h3 className=" font-semibold text-gray-500 mb-3">
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
              {currentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span className="mt-0.5 text-gray-400">•</span>

                  <div className="wrap-break-words whitespace-normal">
                     
                    <span className="text-gray-600">
                      {item.description}
                    </span>

                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {item.relativeTime}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* WEEKLY SUMMARY */}
        <section>
          <h3 className=" font-semibold text-gray-500 mb-3">
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

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-600 wrap-break-words whitespace-normal">
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
  
        <section>
          <h3 className="font-semibold text-gray-500 mb-3">
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
              <ul className="space-y-1">
                {visibleFullActivity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 text-sm leading-relaxed"
                  >
                    <span className="mt-0.5 text-gray-400">•</span>

                    <div className="wrap-break-words whitespace-normal">
                      <span className="text-gray-600">
                        {item.description}
                      </span>

                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* MORE BUTTON */}
              {!showAll && fullActivity.length > VISIBLE_COUNT && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs text-blue-600 hover:underline mt-2"
                >
                  more...
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
