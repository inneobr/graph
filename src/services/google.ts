import * as cheerio from "cheerio";

export interface SearchResult {
  title: string;
  link: string;
  description: string;
}

export async function GoogleService(query: string): Promise<SearchResult[]> {
  try {
    const url = `http://10.1.1.2:8080/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8"
      }
    });

    if (!response.ok) {
      throw new Error(`Falha na requisição GoogleService: status ${response.status}`);
    }

    const html = await response.text();

    if (!html) {
      throw new Error("Resposta do GoogleService está vazia");
    }

    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    const resultsElements = $('article.result');
    if (!resultsElements.length) {
      console.warn("Nenhum resultado encontrado no GoogleService para a query:", query);
    }

    resultsElements.each((_, elem) => {
      const title = $(elem).find('h3 a').text().trim();
      const link = $(elem).find('a.url_header').attr('href') || '';
      const description = $(elem).find('p.content').text().trim();

      // Adiciona só resultados que tenham título e link válidos
      if (title && link) {
        results.push({ title, link, description });
      }
    });

    return results;
  } catch (error) {
    console.error("Erro no GoogleService:", error);
    return [];
  }
}
