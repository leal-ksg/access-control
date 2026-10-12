const response = await fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email: "123@123.com",
        password: "123"
    })
});

console.log("Status:", response.status);

const data = await response.json();

console.log("Resposta:", data);