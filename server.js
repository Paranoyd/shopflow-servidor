const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor ShopFlow activo');
});
const wss = new WebSocket.Server({ server });

const produtos = [
    { nome: "Portátil", preco: 900 },
    { nome: "Rato", preco: 20 },
    { nome: "Monitor", preco: 200 }
];

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

server.listen(3000);