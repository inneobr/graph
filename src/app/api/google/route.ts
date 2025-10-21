import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search_query");

    if(!query) return NextResponse.json({status: "running"},{ status: 200 });
    const searxng = process.env.SEARXNG_SERVER || 'http://10.1.1.2:8080';
    const response = await fetch(`${searxng}/search?q=$${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const results: Array<{title: string; link: string; description: string}> = [];

    $('article.result').each((i, elem) => {
  const title = $(elem).find('h3 a').text().trim();
  const link = $(elem).find('a.url_header').attr('href') || '';
  const description = $(elem).find('p.content').text().trim();

  results.push({ title, link, description });
});

    return NextResponse.json(results);

  } catch (error) {
    console.error("Erro ao buscar dados do SearxNG:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dados", error: String(error) },
      { status: 500 }
    );
  }
}
