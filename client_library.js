class MarketplaceOfIdeasClient {
    constructor(url) {
        this.url = url;
        this.requestId = 1;
    }

    async rpcRequest(method, params) {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: this.requestId++,
                method,
                params
            })
        });
        const data = await response.json();
        return data.result;
    }

    submitIdea(description, author) {
        return this.rpcRequest('submitIdea', [description, author]);
    }
}
