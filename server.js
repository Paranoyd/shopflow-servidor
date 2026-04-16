const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor ShopFlow activo');
});
const wss = new WebSocket.Server({ server });

const URL_PRODUTOS = 'https://raw.githubusercontent.com/Paranoyd/shopflow-dashboard/refs/heads/main/data/produtos.json';

let produtos = [];

// Função para atualizar os produtos a partir do GitHub
async function carregarProdutosDoGithub() {
    try {
        const response = await fetch(URL_PRODUTOS);
        if (!response.ok) throw new Error('Erro ao carregar ficheiro');
        
        produtos = await response.json();
        console.log('Produtos carregados do repositório da dashboard.');
    } catch (error) {
        console.error('Erro ao procurar dados no GitHub:', error);
        // Fallback: manter a lista vazia ou usar um backup local
    }
}

// Chamar a função ao iniciar o servidor
carregarProdutosDoGithub();

function gerarVenda() {
    const p = produtos[Math.floor(Math.random() * produtos.length)];
    return {
        tipo: 'venda',
        produto: p.nome,
        total: p.preco
    };
}

function broadcast(venda) {
    wss.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify(venda));
        }
    });
}

setInterval(() => {
    broadcast(gerarVenda());
}, 4000);

server.listen(process.env.PORT || 3000);