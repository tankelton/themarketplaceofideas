document.addEventListener("DOMContentLoaded", function() {
    const submitIdeaForm = document.getElementById("submitIdeaForm");
    const registerExpertForm = document.getElementById("registerExpertForm");

    submitIdeaForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const description = document.getElementById("ideaDescription").value;
        const author = document.getElementById("ideaAuthor").value;
        sendRPCRequest("submitIdea", [description, author]);
    });

    registerExpertForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const expertAddress = document.getElementById("expertAddress").value;
        const expertiseArea = document.getElementById("expertiseArea").value;
        sendRPCRequest("registerExpert", [expertAddress, expertiseArea]);
    });

    function sendRPCRequest(method, params) {
        // Change the URL to your Node.js server's address
        const serverURL = "http://localhost:4001/json-rpc";
        const requestPayload = {
            jsonrpc: "2.0",
            id: Math.floor(Math.random() * 1000),
            method,
            params
        };

        fetch(serverURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestPayload)
        }).then(response => response.json())
          .then(data => console.log(data));
    }
});
