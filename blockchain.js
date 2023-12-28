const crypto = require('crypto');
const Wallet = require("./wallet");

class SmartContract {
    constructor() {
        this.ideas = {};  // Store ideas by a unique identifier
        this.experts = {};  // Store experts by their wallet address
        this.daos = {};
        this.logs = [];
    }
    // Logging mechanism
    log(action, details) {
        this.logs.push({ action, details, timestamp: new Date().toISOString() });
    }

    // Create a new DAO
    createDAO(daoName, daoDescription, proposerWalletAddress) {
        if (this.daos[daoName]) {
            throw new Error("DAO with the same name already exists.");
        }
        
        this.daos[daoName] = {
            description: daoDescription,
            members: [proposerWalletAddress],
            proposals: []
        };

        // Initialize DAO wallet
        this.daos[daoName].wallet = new Wallet();

        this.log('DAO Created', { daoName, proposerWalletAddress });
    }

    // Manage DAO Membership
    addMember(daoName, newMemberWalletAddress) {
        const dao = this.daos[daoName];
        
        if (!dao) {
            throw new Error("DAO does not exist.");
        }

        dao.members.push(newMemberWalletAddress);

        this.log('Member Added', { daoName, newMemberWalletAddress });
    }

    // Handle DAO Funds
    depositFunds(daoName, amount, depositorWalletAddress) {
        const dao = this.daos[daoName];
        
        if (!dao) {
            throw new Error("DAO does not exist.");
        }

        dao.wallet.deposit(amount, depositorWalletAddress);  // Assuming your Wallet class has a deposit method

        this.log('Funds Deposited', { daoName, amount, depositorWalletAddress });
    }

    // Propose a new project within a DAO
    proposeProject(daoName, projectName, projectDescription, budget, proposerWalletAddress, votingDeadline) {
        const dao = this.daos[daoName];
        
        if (!dao) {
            throw new Error("DAO does not exist.");
        }

        if (!dao.members.includes(proposerWalletAddress)) {
            throw new Error("Only DAO members can propose projects.");
        }

        const proposal = {
            name: projectName,
            description: projectDescription,
            budget: budget,
            proposer: proposerWalletAddress,
            votes: [],
            status: 'pending',
            deadline: new Date(votingDeadline).getTime()
        };

        dao.proposals.push(proposal);

        this.log('Project Proposed', { daoName, projectName, proposerWalletAddress, votingDeadline });
    }

    // Detailed Voting Mechanisms (Weighted Voting)
    voteOnProject(daoName, proposalIndex, voterWalletAddress, voteType, stake) {
        const dao = this.daos[daoName];
        
        if (!dao) {
            throw new Error("DAO does not exist.");
        }

        if (!dao.members.includes(voterWalletAddress)) {
            throw new Error("Only DAO members can vote.");
        }

        this.checkVotingDeadline(daoName, proposalIndex);  // Check if the voting deadline has expired

        const proposal = dao.proposals[proposalIndex];
        
        proposal.votes.push({
            voter: voterWalletAddress,
            type: voteType,
            stake: stake
        });

        const totalStake = proposal.votes.reduce((acc, vote) => acc + vote.stake, 0);

        if (totalStake >= dao.members.length / 2) {
            const approvedStake = proposal.votes.filter(vote => vote.type === 'approve').reduce((acc, vote) => acc + vote.stake, 0);

            proposal.status = approvedStake > totalStake / 2 ? 'approved' : 'rejected';
        }

        this.log('Vote Cast', { daoName, proposalIndex, voterWalletAddress, voteType });
    }

    // Check if voting deadline has expired
    checkVotingDeadline(daoName, proposalIndex) {
        const dao = this.daos[daoName];
        const proposal = dao.proposals[proposalIndex];
        const currentTime = new Date().getTime();

        if (currentTime > proposal.deadline) {
            throw new Error("Voting deadline has expired.");
        }
    }


    // Register a new expert and optionally link to other wallets for reputation
    registerExpert(walletAddress, expertiseArea, linkedWallets = []) {
        this.experts[walletAddress] = {
            expertiseArea,
            reputation: 0,
            vouches: []  // List of experts who have vouched for this expert
        };

        // If linkedWallets are provided, add their reputation to this new expert
        for (const linkedWallet of linkedWallets) {
            if (this.experts[linkedWallet]) {
                this.experts[walletAddress].reputation += this.experts[linkedWallet].reputation;
            }
        }
    }

    // Vouch for another expert
    vouchForExpert(voucherWallet, voucheeWallet) {
        if (this.experts[voucherWallet] && this.experts[voucheeWallet]) {
            this.experts[voucheeWallet].vouches.push(voucherWallet);
            this.experts[voucheeWallet].reputation += this.experts[voucherWallet].reputation;
        }
    }

    // Submit a new idea
    submitIdea(ideaId, description, authorWallet) {
        this.ideas[ideaId] = {
            description,
            authorWallet,
            votes: 0,
            milestones: []
        };
    }

    // Vote for an idea
    voteForIdea(ideaId, voterWallet) {
        if (this.ideas[ideaId]) {
            this.ideas[ideaId].votes += 1;
        }
    }

    // Add a milestone to an idea
    addMilestone(ideaId, milestoneDescription, expertWallet) {
        if (this.ideas[ideaId]) {
            this.ideas[ideaId].milestones.push({
                milestoneDescription,
                expertWallet
            });
        }
    }
}



class Block {
    constructor(index, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(
            this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions)
        ).digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.smartContract = new SmartContract();
    }

    // Create the genesis block
    createGenesisBlock() {
        return new Block(Date.now(), "Genesis Block", "0");
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new transaction to the pool of pending transactions
    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Process a new transaction
    processTransaction(transaction) {
        // Validate the transaction (e.g., check the signature) - skipped for brevity

        // Process the transaction based on its type
        switch (transaction.type) {
            case 'registerExpert':
                this.smartContract.registerExpert(transaction.walletAddress, transaction.expertiseArea);
                break;
            case 'submitIdea':
                this.smartContract.submitIdea(transaction.ideaId, transaction.description, transaction.authorWallet);
                break;
            case 'voteForIdea':
                this.smartContract.voteForIdea(transaction.ideaId, transaction.voterWallet);
                break;
            case 'addMilestone':
                this.smartContract.addMilestone(transaction.ideaId, transaction.milestoneDescription, transaction.expertWallet);
                break;
            case 'vouchForExpert':
                this.smartContract.vouchForExpert(transaction.voucherWallet, transaction.voucheeWallet);
                break;
            // ... (other transaction types)
        }

        // Add the transaction to the list of pending transactions
        this.addTransaction(transaction);

        // Mint a new block if there are enough pending transactions
        if (this.pendingTransactions.length >= 10) {
            this.mintBlock();
        }
    }

    // Mint a new block and add it to the chain
    mintBlock() {
        // Create a new block using all the pending transactions
        const newBlock = new Block(Date.now(), this.pendingTransactions);
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();

        // Add the new block to the chain
        this.chain.push(newBlock);

        // Clear the list of pending transactions
        this.pendingTransactions = [];

        console.log(`New block (#${newBlock.index}) has been added to the blockchain.`);
    }
}

// You would also include your SmartContract class, Wallet class, and Block class in the same file
// or import them from other files.




module.exports = { SmartContract, Block, Blockchain };
