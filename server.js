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
    // Se a lista estiver vazia ou não tiver sido carregada, ignora esta execução
    if (!produtos || produtos.length === 0) {
        console.log("Aguardando carregamento de produtos...");
        return; 
    }

    // A sua lógica de sorteio (exemplo):
    const p = produtos[Math.floor(Math.random() * produtos.length)];

    // Agora é seguro aceder a p.nome
    const novaVenda = {
        produto: p.nome,
        valor: p.preco,
        // ... restante código
    };

    io.emit('novaVenda', novaVenda);
}

function broadcast(venda) {
    wss.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify(venda));
        }
    });
}

setInterval(() => {
    if (produtos.length > 0) {
        gerarVenda();
    }
}, 5000);

server.listen(process.env.PORT || 3000);