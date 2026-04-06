interface XPostResult {
  success: boolean;
  post_id?: string;
  post_url?: string;
  error?: string;
}

export async function postToX(content: string): Promise<XPostResult> {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { success: false, error: "X API credentials not configured" };
  }

  try {
    // OAuth 1.0a signing
    const { createHmac } = await import("crypto");

    const method = "POST";
    const url = "https://api.x.com/2/tweets";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = createHmac("sha256", Date.now().toString())
      .update("nonce")
      .digest("hex")
      .slice(0, 32);

    const params: Record<string, string> = {
      oauth_consumer_key: apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_token: accessToken,
      oauth_version: "1.0",
    };

    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join("&");

    const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
    const signature = createHmac("sha1", signingKey)
      .update(signatureBase)
      .digest("base64");

    const authHeader = `OAuth oauth_consumer_key="${encodeURIComponent(apiKey)}", oauth_nonce="${encodeURIComponent(nonce)}", oauth_signature="${encodeURIComponent(signature)}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${timestamp}", oauth_token="${encodeURIComponent(accessToken)}", oauth_version="1.0"`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: content }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("X API error:", errorData);
      return { success: false, error: `X API error: ${response.status}` };
    }

    const data = await response.json();
    const postId = data.data?.id;

    return {
      success: true,
      post_id: postId,
      post_url: postId
        ? `https://x.com/i/status/${postId}`
        : undefined,
    };
  } catch (error) {
    console.error("X posting error:", error);
    return { success: false, error: "X 포스팅 중 오류 발생" };
  }
}
