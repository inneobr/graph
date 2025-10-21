'use client';

export default function Home() {
  const apis = [
    {
      route: '/api/google?search_query=sabedoria',
      method: 'GET',
      description: 'Faz uma pesquisa na internet pela palavra sabedoria',
      response: { results: [{
        "title": "Sabedoria - Dicio, Dicionário Online de Português",
        "link": "https://www.dicio.com.br/sabedoria/",
        "description": "O que é sabedoria: s.f. Característica de sábio, de quem tem muitos conhecimentos, de quem sabe muito: ensinava os mais jovens com sua sabedoria. Excesso de conhecimento; erudição: o físico foi premiado por sua sabedoria."
        },
        {
        "title": "Sabedoria: entenda o que é - Significados",
        "link": "https://www.significados.com.br/sabedoria/",
        "description": "Sabedoria é a característica de uma pessoa sábia e que significa um conhecimento extenso e profundo de várias coisas ou de um tópico em particular. A sabedoria muitas vezes é indicativo de uma pessoa instruída, que tem muito juízo, bom senso e se comporta com retidão."
        }] },
    },
    {
      route: '/api/youtube?search_query=sabedoria',
      method: 'GET',
      description: 'Faz uma pesquisa no youtube pela palavra sabedoria.',
      response: [{
        "uuid": "xfapwoTg7ik",
        "title": "Sabedoria Divina: Como Buscar, Aplicar e Viver Uma Vida Próspera e Protegida | Tiago Brunet",
        "link": "https://www.youtube.com/watch?v=xfapwoTg7ik",
        "thumbnail": "https://i.ytimg.com/vi/xfapwoTg7ik/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCT9S1Fs01m-19opWW1S-vjz1_DhA",
        "channel": "Tiago Brunet"
        },
        {
        "uuid": "zUghDZkUgj8",
        "title": "25 Lições de Sabedoria do Rei Salomão para o Dia a Dia",
        "link": "https://www.youtube.com/watch?v=zUghDZkUgj8",
        "thumbnail": "https://i.ytimg.com/vi/zUghDZkUgj8/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLD1Yba3e0js_gpbFNQgLrmy8LxaZg",
        "channel": "Sementes da Pureza"
        }],
    },
    {
      route: '/graphql',
      method: 'GET',
      description: 'Abre o apolo client.',
      response: 'Documentation graphql',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-2 text-white">
      <div className="flex flex-col container mx-auto max-w-4xl gap-4">
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
          <h1 className="text-2xl font-bold">inneo.org</h1>
          <p>Serviçoes diponíveis no servidor</p>
        </div>

        <div className="space-y-2">
          {apis.map((api, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
              <div className="mb-2">
                <span className="text-sm font-mono bg-slate-700 px-2 py-1 rounded text-purple-300 mr-2">
                  {api.method}
                </span>
                <span className="text-lg font-semibold">{api.route}</span>
              </div>
              <p className="text-slate-300 mb-3">{api.description}</p>
              <div>
                <p className="text-sm text-slate-400 mb-1">resposta:</p>
                <pre className="bg-slate-900 p-3 rounded text-sm overflow-x-auto text-green-400">
                  {JSON.stringify(api.response, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
