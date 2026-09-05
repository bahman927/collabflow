import {ActivityPanel} from "../components/ActivityPanel"

export default function ActivityPage() {
  return (
    <div className="w-full flex justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-xl font-semibold mb-4">Team Activity</h1>

        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4">
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}

