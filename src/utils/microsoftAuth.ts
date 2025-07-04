const MICROSOFT_CONFIG = {
  clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/microsoft/callback`,
  scope: "Files.Read.All offline_access",
  responseType: "code",
  responseMode: "query",
};

const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const initiateMicrosoftAuth = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomUUID();

  sessionStorage.setItem("pkce_verifier", codeVerifier);
  sessionStorage.setItem("oauth_state", state);

  // Build authorization URL
  const tenantId = import.meta.env.VITE_MICROSOFT_TENANT_ID;
  const authUrl = new URL(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
  );
  authUrl.searchParams.append("client_id", MICROSOFT_CONFIG.clientId);
  authUrl.searchParams.append("response_type", MICROSOFT_CONFIG.responseType);
  authUrl.searchParams.append("redirect_uri", MICROSOFT_CONFIG.redirectUri);
  authUrl.searchParams.append("scope", MICROSOFT_CONFIG.scope);
  authUrl.searchParams.append("response_mode", MICROSOFT_CONFIG.responseMode);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("code_challenge", codeChallenge);
  authUrl.searchParams.append("code_challenge_method", "S256");

  // Redirect to Microsoft consent screen
  window.location.href = authUrl.toString();
};
