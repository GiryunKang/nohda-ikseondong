interface InstagramPostResult {
  success: boolean;
  post_id?: string;
  post_url?: string;
  error?: string;
}

export async function postToInstagram(
  caption: string,
  imageUrl?: string
): Promise<InstagramPostResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    return { success: false, error: "Instagram API credentials not configured" };
  }

  try {
    // Step 1: Create media container
    const containerParams = new URLSearchParams({
      access_token: accessToken,
      caption,
    });

    if (imageUrl) {
      containerParams.set("image_url", imageUrl);
    } else {
      // Instagram requires an image for feed posts
      // Use a placeholder or skip
      return {
        success: false,
        error: "Instagram에 이미지 없이 포스팅할 수 없습니다.",
      };
    }

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${accountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: containerParams.toString(),
      }
    );

    if (!containerResponse.ok) {
      const errorData = await containerResponse.text();
      console.error("Instagram container error:", errorData);
      return { success: false, error: `Instagram API error: ${containerResponse.status}` };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Step 2: Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${accountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: accessToken,
          creation_id: containerId,
        }).toString(),
      }
    );

    if (!publishResponse.ok) {
      const errorData = await publishResponse.text();
      console.error("Instagram publish error:", errorData);
      return { success: false, error: `Instagram publish error: ${publishResponse.status}` };
    }

    const publishData = await publishResponse.json();

    return {
      success: true,
      post_id: publishData.id,
      post_url: `https://www.instagram.com/p/${publishData.id}/`,
    };
  } catch (error) {
    console.error("Instagram posting error:", error);
    return { success: false, error: "Instagram 포스팅 중 오류 발생" };
  }
}
