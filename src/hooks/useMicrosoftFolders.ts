import { useState } from "react";

export const useMicrosoftFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFolders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/microsoft/folders", {});

      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }

      const data = await response.json();
      console.log("Fetched folders:", data);
      setFolders(data.folders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { folders, loading, error, fetchFolders };
};
