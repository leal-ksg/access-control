import mqtt, { IClientOptions } from "mqtt";
import { mqttRouter } from "../routes/mqtt";

const brokerUrl = process.env.MQTT_BROKER_URL || "mqtt://192.168.1.81:1883";
const options: IClientOptions = {
  username: process.env.MQTT_BROKER_USERNAME || "dev_mqtt_user",
  password: process.env.MQTT_BROKER_PASSWORD || "dev_mqtt_password",
};

const mqttClient = mqtt.connect(brokerUrl, options);

mqttClient.on("connect", () => {
  console.log("-> Broker MQTT conectado com sucesso!");

  mqttRouter
    .getSubscriptions()
    .forEach((subscription) => mqttClient.subscribe(subscription));
});

mqttClient.on("error", (err) => {
  console.log("- Erro no Broker MQTT:", err);
});

mqttClient.on("message", async (topic, message) => {
  await mqttRouter.handle(topic, message);
});

export default mqttClient;
