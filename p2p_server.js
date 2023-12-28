const WebSocket = require('ws');

const startP2PServer = (blockchain, port) => {
    const server = new WebSocket.Server({ port });
    server.on('connection', ws => initConnection(ws, blockchain));
    console.log(`P2P server running on ws://localhost:${port}`);
};

const initConnection = (ws, blockchain) => {
    ws.on('message', data => {
        const receivedChain = JSON.parse(data);
        if (receivedChain.length > blockchain.chain.length) {
            console.log('Received blockchain is longer. Replacing current blockchain.');
            blockchain.chain = receivedChain;
        }
    });

    ws.send(JSON.stringify(blockchain.chain));
};

module.exports = startP2PServer;
