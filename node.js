const { Blockchain } = require('./blockchain');
const startRPCServer = require('./rpc_server');
const startP2PServer = require('./p2p_server');
console.log(startRPCServer);

const HTTP_PORT = process.env.HTTP_PORT || 4001;
const P2P_PORT = process.env.P2P_PORT || 6001;

const blockchain = new Blockchain();

setInterval(() => {
    blockchain.mintBlock();
    console.log('New block minted by', blockchain.selectMinter());
}, 60000);

// Start JSON-RPC server
startRPCServer(blockchain, HTTP_PORT);

// Start P2P WebSocket server
startP2PServer(blockchain, P2P_PORT);
