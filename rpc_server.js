const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, SmartContract } = require('./blockchain');  // Assuming you have a Blockchain class in a file named Blockchain.js
  // Import your SmartContract class

console.log(Blockchain);
const cors = require('cors');

const startRPCServer = (blockchain, port) => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    
    
    
    app.post('/json-rpc', (req, res) => {
        const { method, params } = req.body;
        let transactionData;  // Declare the variable once here
        console.log(method);
        switch (method) {
            
            case 'registerExpert':
                // Validate the parameters
                if (!params.walletAddress || !params.expertiseArea) {
                    return res.json({ error: 'Missing parameters' });
                }

                // Populate transactionData
                transactionData = {
                    type: 'registerExpert',
                    walletAddress: params.walletAddress,
                    expertiseArea: params.expertiseArea,
                    linkedWallets: params.linkedWallets || []
                };

                // Process the transaction
                blockchain.processTransaction(transactionData);

                // Send success response
                res.json({ result: 'Expert registered successfully' });
                break;

            case 'submitIdea':
                // Validate the parameters
                if (!params.ideaId || !params.description || !params.authorWallet) {
                    return res.json({ error: 'Missing parameters' });
                }

                // Populate transactionData
                transactionData = {
                    type: 'submitIdea',
                    ideaId: params.ideaId,
                    description: params.description,
                    authorWallet: params.authorWallet
                };

                // Process the transaction
                blockchain.processTransaction(transactionData);

                // Send success response
                res.json({ result: 'Idea submitted successfully' });
                break;
            
    // ... (existing cases for other methods)

    // DAO functionality
    case 'createDAO':
                result = smartContract.createDAO(params.name, params.description, params.proposerWalletAddress);
                console.log(result);
                console.log(smartContract.daos);
        break;
    case 'addMember':
        result = smartContract.addMember(params.daoName, params.newMemberWalletAddress);
        break;
    case 'depositFunds':
        result = smartContract.depositFunds(params.daoName, params.amount, params.depositorWalletAddress);
        break;
    case 'proposeProject':
        result = smartContract.proposeProject(params.daoName, params.projectName, params.projectDescription, params.budget, params.proposerWalletAddress, params.votingDeadline);
        break;
    case 'voteOnProject':
        result = smartContract.voteOnProject(params.daoName, params.proposalIndex, params.voterWalletAddress, params.voteType, params.stake);
        break;
    


            default:
                res.json({ error: 'Unknown JSON-RPC method' });
        }
    });

    app.get('/api/wallet/balance/:publicKey', (req, res) => {
        const publicKey = req.params.publicKey;
        const balance = blockchain.getBalanceOfWallet(publicKey);  // Implement this method in your Blockchain class
        res.json({ balance });
    });

    // API to get the assets of a wallet
    app.get('/api/wallet/assets/:publicKey', (req, res) => {
        const publicKey = req.params.publicKey;
        const assets = blockchain.getAssetsOfWallet(publicKey);  // Implement this method in your Blockchain class
        res.json({ assets });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`RPC Server is running on port ${port}`);
    });
};

// Create a new Blockchain instance and start the server
const blockchain = new Blockchain();
const smartContract = new SmartContract();
const port = 4000;  // You can choose any port
startRPCServer(blockchain, port);
// In rpc_server.js or wherever startRPCServer is defined
module.exports = startRPCServer;
