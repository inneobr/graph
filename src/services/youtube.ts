type VideoRenderer = {
  videoId: string;
  title?: { runs?: { text: string }[] };
  thumbnail?: { thumbnails?: { url: string }[] };
  ownerText?: { runs?: { text: string }[] };
};

type Video = { videoRenderer?: VideoRenderer };

type Section = { itemSectionRenderer?: { contents?: Video[] } };

interface YouTubeResult {
  uuid: string;
  title: string;
  link: string;
  thumbnail: string;
  channel: string;
}

interface YouTubeSearchResponse {
  contents?: {
    twoColumnSearchResultsRenderer?: {
      primaryContents?: {
        sectionListRenderer?: {
          contents?: Section[];
        };
      };
    };
  };
}

export async function YouTubeService(query: string): Promise<YouTubeResult[]> {
  try {
    const homeRes = await fetch("https://www.youtube.com", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!homeRes.ok) {
      throw new Error(`Falha ao acessar YouTube: status ${homeRes.status}`);
    }

    const homeHtml = await homeRes.text();

    const keyMatch = homeHtml.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
    const versionMatch = homeHtml.match(/"INNERTUBE_CONTEXT_CLIENT_VERSION":"([^"]+)"/);

    if (!keyMatch || !versionMatch) {
      throw new Error("Não foi possível extrair key ou version do YouTube");
    }

    const apiKey = keyMatch[1];
    const clientVersion = versionMatch[1];

    const searchRes = await fetch(
      `https://www.youtube.com/youtubei/v1/search?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Youtube-Client-Name": "1",
          "X-Youtube-Client-Version": clientVersion,
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion,
            },
          },
          query,
        }),
      }
    );

    if (!searchRes.ok) {
      throw new Error(`Erro na busca no YouTube: status ${searchRes.status}`);
    }

    const searchJson: YouTubeSearchResponse = await searchRes.json();

    const items: Section[] =
      searchJson.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents || [];

    const results: YouTubeResult[] = [];

    for (const section of items) {
      const videos = section.itemSectionRenderer?.contents || [];
      for (const video of videos) {
        const vr = video.videoRenderer;
        if (!vr || !vr.videoId) continue;

        const title = vr.title?.runs?.[0]?.text ?? "";
        const link = `https://www.youtube.com/watch?v=${vr.videoId}`;
        const thumbnail = vr.thumbnail?.thumbnails?.[0]?.url ?? "";
        const channel = vr.ownerText?.runs?.[0]?.text ?? "";

        results.push({ uuid: vr.videoId, title, link, thumbnail, channel });
      }
    }

    return results;
  } catch (error) {
    console.error("Erro no YouTubeService:", error);
    return [];
  }
}
