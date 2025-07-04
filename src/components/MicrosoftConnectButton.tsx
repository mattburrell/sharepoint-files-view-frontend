import { useState } from "react";
import { initiateMicrosoftAuth } from "../utils/microsoftAuth";

const MicrosoftConnectButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await initiateMicrosoftAuth();
    } catch (error) {
      console.error("Failed to initiate Microsoft auth:", error);
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
    >
      {isConnecting ? "Connecting..." : "Connect SharePoint/OneDrive Folder"}
    </button>
  );
};

export default MicrosoftConnectButton;
