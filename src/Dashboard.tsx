import { useEffect } from "react";
import MicrosoftConnectButton from "./components/MicrosoftConnectButton";
import { useMicrosoftFolders } from "./hooks/useMicrosoftFolders";

function Dashboard() {
  const { folders, loading, error, fetchFolders } = useMicrosoftFolders();

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <MicrosoftConnectButton />

      {loading && <p>Loading folders...</p>}
      {error && <p>Error: {error}</p>}

      {folders.length > 0 && (
        <div>
          <h2>Available Folders:</h2>
          <ul>
            {folders.map((folder: any) => (
              <li key={folder.id}>
                <strong>{folder.name}</strong> ({folder.type})
                <a
                  href={folder.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
