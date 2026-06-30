import axios, { AxiosError } from "axios";

type VerifyResult = { valid: boolean; error?: string };

export async function verifyGeminiKey(apiKey: string): Promise<VerifyResult> {
  try {
    await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models`,
      { params: { key: apiKey } }
    );
    return { valid: true };
  } catch (err) {
    const e = err as AxiosError;
    if (e.response?.status === 400 || e.response?.status === 403) {
      return { valid: false, error: "Invalid Gemini API key" };
    }
    if (e.response) {
      return { valid: false, error: `Unexpected status ${e.response.status}` };
    }
    return { valid: false, error: "Network error verifying Gemini key" };
  }
}

export async function verifyTavilyKey(apiKey: string): Promise<VerifyResult> {
  try {
    await axios.post("https://api.tavily.com/search", {
      api_key: apiKey,
      query: "test",
      max_results: 1,
    });
    return { valid: true };
  } catch (err) {
    const e = err as AxiosError;
    if (e.response?.status === 401 || e.response?.status === 403) {
      return { valid: false, error: "Invalid Tavily API key" };
    }
    if (e.response) {
      return { valid: false, error: `Unexpected status ${e.response.status}` };
    }
    return { valid: false, error: "Network error verifying Tavily key" };
  }
}

export async function verifyGoogleRefreshToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<VerifyResult & { accessToken?: string; expiresIn?: number }> {
  try {
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return { valid: true, accessToken: data.access_token, expiresIn: data.expires_in };
  } catch (err) {
    const e = err as AxiosError<{ error_description?: string }>;
    if (e.response) {
      return {
        valid: false,
        error: e.response.data?.error_description || `Status ${e.response.status}`,
      };
    }
    return { valid: false, error: "Network error verifying Google token" };
  }
}

export async function verifySpotifyRefreshToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<VerifyResult & { accessToken?: string; expiresIn?: number }> {
  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
      }
    );
    return { valid: true, accessToken: data.access_token, expiresIn: data.expires_in };
  } catch (err) {
    const e = err as AxiosError<{ error_description?: string }>;
    if (e.response) {
      return {
        valid: false,
        error: e.response.data?.error_description || `Status ${e.response.status}`,
      };
    }
    return { valid: false, error: "Network error verifying Spotify token" };
  }
}