import {ActivityPanel} from "../components/ActivityPanel"

export default function ActivityPage() {
  return (
    <div className="flex min-w-0 w-full justify-center px-3 py-5 sm:px-4 sm:py-8">
      <div className="w-full min-w-0 max-w-2xl">
        <h1 className="mb-4 text-xl font-semibold sm:text-2xl">
          Team Activity
        </h1>

        <div className="min-w-0 overflow-hidden rounded-xl border border-green-200 bg-white p-3 shadow-sm sm:p-4">
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}