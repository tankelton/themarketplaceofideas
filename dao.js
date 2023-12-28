// Function to simulate wallet generation (Replace with your actual wallet generation logic)
function generateWallet() {
    return "0x" + Math.random().toString(36).substr(2, 9);
}

// Function to make JSON-RPC call to create DAO
async function createDAO(params) {
    const response = await fetch('http://localhost:4000/json-rpc', {  // Replace with your server URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'createDAO',
            params: params,
            id: 1  // Replace with a unique ID if needed
        })
    });

    const data = await response.json();
    return data.result || data.error;
}

// Generate a new wallet when the button is clicked
document.getElementById('generateWallet').addEventListener('click', () => {
    const newWalletAddress = generateWallet();
    document.getElementById('walletAddress').textContent = newWalletAddress;
});

// Handle DAO form submission
document.getElementById('daoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const daoName = event.target.daoName.value;
    const daoDescription = event.target.daoDescription.value;
    const proposerWalletAddress = document.getElementById('walletAddress').textContent;

    if (!proposerWalletAddress) {
        alert('Please generate a wallet first.');
        return;
    }

    const params = { name: daoName, description: daoDescription, proposerWalletAddress: proposerWalletAddress };
    const result = await createDAO(params);
    console.log('DAO creation result:', result);
});
