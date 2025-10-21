import { NextRequest, NextResponse } from "next/server";

type VideoRenderer = {
  videoId: string;
  title?: { runs?: { text: string }[] };
  thumbnail?: { thumbnails?: { url: string }[] };
  ownerText?: { runs?: { text: string }[] };
};

type Video = { videoRenderer?: VideoRenderer };
type Section = { itemSectionRenderer?: { contents?: Video[] } };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search_query");

    if(!query) return NextResponse.json({status: "running"},{ status: 200 });

    const homeRes = await fetch("https://www.youtube.com", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const homeHtml = await homeRes.text();

    const keyMatch = homeHtml.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
    const versionMatch = homeHtml.match(/"INNERTUBE_CONTEXT_CLIENT_VERSION":"([^"]+)"/);

    if (!keyMatch || !versionMatch) {
      return NextResponse.json({ error: "Não foi possível extrair key ou version" }, { status: 500 });
    }

    const apiKey = keyMatch[1];
    const clientVersion = versionMatch[1];

    const searchRes = await fetch(`https://www.youtube.com/youtubei/v1/search?key=${apiKey}`, {
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
    });

    const searchJson = await searchRes.json();

    const items: Section[] =
      searchJson.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

    const results = items.flatMap((section) => {
      const videos = section.itemSectionRenderer?.contents || [];

      return videos
        .map((video) => {
          const vr = video.videoRenderer;
          if (!vr) return null;

          return {
            uuid: vr.videoId,
            title: vr.title?.runs?.[0]?.text || "",
            link: `https://www.youtube.com/watch?v=${vr.videoId}`,
            thumbnail: vr.thumbnail?.thumbnails?.[0]?.url || "",
            channel: vr.ownerText?.runs?.[0]?.text || "",
          };
        })
        .filter(Boolean) as Array<{
          uuid: string;
          title: string;
          link: string;
          thumbnail: string;
          channel: string;
        }>;
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro ao buscar dados do YouTube:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dados", error: String(error) },
      { status: 500 }
    );
  }
}

