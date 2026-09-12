import mqtt, { IClientOptions } from "mqtt";

const brokerUrl = process.env.MQTT_BROKER_URL || "mqtt://192.168.1.81:1883";
const options: IClientOptions = {
  username: process.env.MQTT_BROKER_USERNAME || "dev_mqtt_user",
  password: process.env.MQTT_BROKER_PASSWORD || "dev_mqtt_password",
};

console.log(process.env.MQTT_BROKER_USERNAME);
console.log(process.env.MQTT_BROKER_PASSWORD);
console.log(process.env.MQTT_BROKER_URL);

const mqttClient = mqtt.connect(brokerUrl, options);

mqttClient.on("connect", () => {
  console.log("-> Broker MQTT conectado com sucesso!");

  mqttClient.subscribe("teste");
});

mqttClient.on("error", (err) => {
  console.log("- Erro no Broker MQTT:", err);
});

mqttClient.on("message", (topic, message) => {
  console.log(topic);
  console.log(message.toString());
});

export default mqttClient;
