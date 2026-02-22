import { useWorkspace } from "../hooks/useWorkspace";

const Workspaces = () => {
  const { workspaces } = useWorkspace();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Workspaces</h2>
      <ul>
        {workspaces.map(ws => (
          <li key={ws.id}>{ws.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Workspaces;
