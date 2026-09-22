const response = await fetch("http://localhost:3000/api/v1/users");

console.log("Status:", response.status);

const data = await response.json();

console.log("Resposta:", data);