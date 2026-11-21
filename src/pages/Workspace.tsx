import { useWorkspace } from "../hooks/useWorkspace";

const Workspaces = () => {
  const { workspaces } = useWorkspace();

return (
  <div className="min-w-0 w-full">
    <h2 className="mb-3 text-lg font-semibold text-gray-800 sm:mb-4 sm:text-xl">
      Workspaces
    </h2>

    {workspaces.length === 0 ? (
      <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
        No workspaces available.
      </p>
    ) : (
      <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((ws) => (
          <li
            key={ws.id}
            className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium text-gray-800 shadow-sm transition hover:shadow-md sm:p-4 sm:text-base"
          >
            <span className="wrap-break-word">{ws.name}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};

export default Workspaces;
