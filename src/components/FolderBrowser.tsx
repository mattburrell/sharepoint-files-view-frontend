import React, { useState, useEffect } from "react";

const FolderIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

const SharePointIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H17a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const OneDriveIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
      clipRule="evenodd"
    />
  </svg>
);

const ExternalLinkIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const RefreshIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const FolderBrowser = ({ onFolderSelect = null, selectedFolderId = null }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'onedrive', 'sharepoint'
  const [sortBy, setSortBy] = useState("name"); // 'name', 'type', 'recent'

  const fetchFolders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/microsoft/folders", {});

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Microsoft account not connected");
        }
        throw new Error("Failed to fetch folders");
      }

      const data = await response.json();
      setFolders(data.folders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const filteredAndSortedFolders = React.useMemo(() => {
    const filtered = folders.filter((folder: any) => {
      const matchesSearch = folder.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || folder.type === filterType;
      return matchesSearch && matchesType;
    });

    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "recent":
          // For demo purposes, randomize order
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    return filtered;
  }, [folders, searchTerm, filterType, sortBy]);

  const getTypeIcon = (type: any) => {
    switch (type) {
      case "sharepoint":
        return <SharePointIcon className="w-5 h-5 text-blue-600" />;
      case "onedrive":
        return <OneDriveIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <FolderIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTypeLabel = (type: any) => {
    switch (type) {
      case "sharepoint":
        return "SharePoint";
      case "onedrive":
        return "OneDrive";
      default:
        return "Folder";
    }
  };

  const handleFolderClick = (folder: any) => {
    if (onFolderSelect) {
      onFolderSelect(folder);
    }
  };

  const handleOpenExternal = (webUrl: any, e: any) => {
    e.stopPropagation();
    window.open(webUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading folders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unable to Load Folders
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchFolders}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshIcon className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Microsoft Folders
          </h2>
          <button
            onClick={fetchFolders}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <RefreshIcon className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="onedrive">OneDrive</option>
            <option value="sharepoint">SharePoint</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
            <option value="recent">Recently Used</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {filteredAndSortedFolders.length === 0 ? (
          <div className="text-center py-8">
            <FolderIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {searchTerm || filterType !== "all"
                ? "No matching folders"
                : "No folders found"}
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Connect your Microsoft account to see available folders."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredAndSortedFolders.map((folder: any) => (
              <div
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                className={`
                  flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer
                  ${
                    selectedFolderId === folder.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }
                  ${onFolderSelect ? "hover:bg-gray-50" : ""}
                `}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getTypeIcon(folder.type)}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {folder.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {getTypeLabel(folder.type)}
                      </span>
                      {selectedFolderId === folder.id && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {folder.webUrl && (
                    <button
                      onClick={(e) => handleOpenExternal(folder.webUrl, e)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                      title="Open in Microsoft"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedFolders.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedFolders.length} of {folders.length}{" "}
            folders
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default FolderBrowser;
