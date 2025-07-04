import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MicrosoftCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error("Missing authorization code or state");
        }

        // Verify state parameter
        const storedState = sessionStorage.getItem("oauth_state");
        if (state !== storedState) {
          throw new Error("Invalid state parameter");
        }

        // Get PKCE verifier
        const codeVerifier = sessionStorage.getItem("pkce_verifier");
        if (!codeVerifier) {
          throw new Error("Missing PKCE verifier");
        }

        // Exchange authorization code for tokens via backend
        const response = await fetch("/api/oauth/microsoft/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            codeVerifier,
            redirectUri: `${window.location.origin}/auth/microsoft/callback`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange authorization code");
        }

        const result = await response.json();
        console.log("OAuth tokens received:", result);

        // Clean up session storage
        sessionStorage.removeItem("pkce_verifier");
        sessionStorage.removeItem("oauth_state");

        setStatus("success");

        // Redirect back to main app
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {status === "processing" && (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Connecting to Microsoft...</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <div className="text-green-600 text-2xl mb-4">✓</div>
            <p>Successfully connected! Redirecting...</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <div className="text-red-600 text-2xl mb-4">✗</div>
            <p>Connection failed. Please try again.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicrosoftCallback;
