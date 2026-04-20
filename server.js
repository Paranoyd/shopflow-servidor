const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor ShopFlow activo');
});

const wss = new WebSocket.Server({ server });

// ── Dados simulados da loja ───────────────────────────
const PRODUTOS = [
    { nome: 'Portátil ShopFlow Pro 15',   preco: 899.99  },
    { nome: 'Portátil ShopFlow Ultra 13', preco: 1149.99 },
    { nome: 'Portátil ShopFlow Gaming 17',preco: 1599.99 },
    { nome: 'Rato Ergonómico SF-M1',       preco: 49.99   },
    { nome: 'Teclado Mecânico SF-K2',      preco: 89.99   },
    { nome: 'Headset SF-H1 Pro',           preco: 79.99   },
    { nome: 'Webcam SF-W1 4K',             preco: 129.99  },
    { nome: 'Monitor SF-D27 QHD',          preco: 349.99  },
    { nome: 'Hub USB-C SF-U1 7-em-1',      preco: 39.99   },
    { nome: 'Mochila SF-B1 15.6"',         preco: 59.99   },
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

// 🔥 CORREÇÃO AQUI
server.listen(process.env.PORT || 3000, () => {
    console.log('Servidor a correr');
});