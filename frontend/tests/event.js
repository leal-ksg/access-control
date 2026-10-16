const response = await fetch("http://localhost:3000/api/v1/events");

console.log("Status:", response.status);

const data = await response.json();

console.log("Resposta:", data);