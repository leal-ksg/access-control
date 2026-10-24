#include <FS.h>
#include <SPIFFS.h>
#include <WiFi.h>
#include <WiFiClientSecure.h> // Biblioteca para conexões SSL/TLS seguras
#include <DNSServer.h> 
#include <WebServer.h>
#include <ArduinoOTA.h>
#include <ElegantOTA.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <PubSubClient.h> // Biblioteca MQTT

// VERSÃO DA PROGRAMAÇÃO
const String NomePrograma = "Access Control ESP32 Secure";
const String Ver = "1-05.00";
const String DataVer = "24/10/2026";

WebServer server(80);
DNSServer dnsServer; 

const char* configFilePath = "/config.json";

// Controle de Modo AP (Portal)
bool modoAP = false;
String autoconf_ssid = "";
const byte DNS_PORT = 53; 

// Configurações globais de rede e MQTT
char ssid[32] = "";
char password[64] = "";
char api_host[80] = "34cff10699af4461a02d87f73edcdc95.s1.eu.hivemq.cloud";  // Host / URL / IP do Broker MQTT
char api_port[6]  = "8883";           // Porta segura TLS padrão
char mqtt_user[64] = "";              // Usuário do Broker MQTT
char mqtt_pass[64] = "";              // Senha do Broker MQTT
char api_token[100] = "TOKEN_ID";
char api_save[4]  = "60";

// Tópico base padrão com barra única (lockers/cmd/)
char mqtt_topic[100] = "lockers/cmd/"; 

// Identificação automática do dispositivo (Hash e MAC)
String deviceHash = "";
String macAddressStr = "";

// Controle de DHCP e IPs de Fallback
bool usa_dhcp = true; 
char static_ip[16]  = "10.0.0.50";
char static_gw[16]  = "10.0.0.1";
char static_sn[16]  = "255.255.255.0";
char static_dns[16] = "8.8.8.8";

// --- VARIÁVEIS DE AUTENTICAÇÃO WEB ---
char web_user[32] = "admin";
char web_pass[32] = "admin";

// --- PINOS E CONTROLE DO RELÉ (ACTIVE LOW) ---
const int LED_PLACA = 2; // LED interno padrão do ESP32 (GPIO 2)
const int RELAY_PIN = 4; // GPIO 4 conectado ao módulo relé

// Relé ativo em nível baixo (Active LOW)
const int RELAY_ON  = LOW;  // Sinal para armar o relé
const int RELAY_OFF = HIGH; // Sinal de repouso (desarmado)

const unsigned long TEMPO_ABERTURA = 2000;

WiFiClientSecure espClient; // Usar cliente seguro com criptografia para a nuvem
PubSubClient mqttClient(espClient);

// Função auxiliar para obter Chip ID único no ESP32
uint32_t getEspChipId() {
  return (uint32_t)(ESP.getEfuseMac() & 0xFFFFFFFF);
}

// Protótipos
void handleConfig();
void handleConfigSave();
void Reboot();
void Resetar();
void handleCSS();
void handleHome();
void handleAbrirPortaLocal();
void handleSenha();        
void handleSenhaSave();    
bool verificarAutenticacao(); 
void ChecarBotaoReset();
void carregarConfigFS();
void salvarConfigFS();
void iniciarModoAP();
void handleCaptivePortal(); 
String gerarMenu();
void callbackMQTT(char* topic, byte* payload, unsigned int length);
void reconectarMQTT();
void publicarStatusOnline();
void acionarTrinco();

//-----------------------------------------------------------------------------------------------------------------

void setup() {
  Serial.begin(115200);

  // Inicializa stack de Wi-Fi antes de solicitar MAC e conexões de rede
  WiFi.mode(WIFI_STA);
  delay(100);

  pinMode(0, INPUT_PULLUP); 
  pinMode(LED_PLACA, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);

  // Garante relé desligado no boot (Nível ALTO)
  digitalWrite(RELAY_PIN, RELAY_OFF); 
  digitalWrite(LED_PLACA, LOW); 

  autoconf_ssid = "CONTROL_AP-" + String(getEspChipId());

  // Gera Hash e MAC com rádio Wi-Fi inicializado
  macAddressStr = WiFi.macAddress();
  deviceHash = "AP_" + String(getEspChipId(), HEX);
  deviceHash.toUpperCase();

  Serial.printf("\nVersão: %s | Data: %s | Hash: %s | MAC: %s \n", Ver.c_str(), DataVer.c_str(), deviceHash.c_str(), macAddressStr.c_str());

  // Permite conexões TLS/SSL sem validar certificados locais no ESP32 (Ignora o handshake estrito do Root CA)
  espClient.setInsecure();

  carregarConfigFS();

  if (digitalRead(0) == LOW || strlen(ssid) == 0) {
    iniciarModoAP();
  } else {
    WiFi.mode(WIFI_STA);

    if (!usa_dhcp) {
      Serial.println(F("Configurando IP Estático fixado pelo JSON..."));
      IPAddress _ip, _gw, _sn, _dns;
      _ip.fromString(static_ip); _gw.fromString(static_gw); _sn.fromString(static_sn); _dns.fromString(static_dns);
      WiFi.config(_ip, _gw, _sn, _dns);
    } else {
      Serial.println(F("Modo DHCP Ativo. Solicitando parâmetros ao roteador..."));
    }

    Serial.printf("Conectando ao Wi-Fi: %s\n", ssid);
    WiFi.begin(ssid, password);

    unsigned long startAttempt = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 12000) {
      delay(500); 
      Serial.print(".");
      yield();
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
      Serial.print(F("Conectado! IP obtido: ")); Serial.println(WiFi.localIP());
      int portaBroker = String(api_port).toInt();
      if (portaBroker == 0) portaBroker = 8883; // Força porta SSL padrão da nuvem caso esteja vazia
      mqttClient.setServer(api_host, portaBroker);
      mqttClient.setCallback(callbackMQTT);
    } else {
      Serial.println(F("Roteador não respondeu de imediato. Operando em background..."));
    }
  }

  // Inicializa OTA e WebServer após rede estabelecida
  ElegantOTA.begin(&server);
  ArduinoOTA.begin();

  // Endpoints do WebServer
  server.on("/", handleHome);
  server.on("/abrir", handleAbrirPortaLocal);
  server.on("/config", handleConfig);
  server.on("/save", handleConfigSave);
  server.on("/reboot", Reboot);
  server.on("/padrao", Resetar);
  server.on("/css", handleCSS);

  server.on("/senha", handleSenha);
  server.on("/senhasave", handleSenhaSave);

  // Captive Portal
  server.on("/generate_204", handleCaptivePortal);  
  server.on("/fwlink", handleCaptivePortal);        
  server.onNotFound(handleCaptivePortal);           

  server.begin();
}

void loop() {
  ChecarBotaoReset();
  ArduinoOTA.handle();

  if (modoAP) {
    dnsServer.processNextRequest();
  } else {
    if (WiFi.status() == WL_CONNECTED) {
      if (!mqttClient.connected()) {
        reconectarMQTT();
      }
      mqttClient.loop();
    }
  }

  server.handleClient();
  yield();
}

void acionarTrinco() {
  Serial.println(F("[TRINCO] Acionando fechadura magnética..."));
  digitalWrite(RELAY_PIN, RELAY_ON);  // Liga relé (LOW)
  digitalWrite(LED_PLACA, HIGH);
  delay(TEMPO_ABERTURA);
  digitalWrite(RELAY_PIN, RELAY_OFF); // Desliga relé (HIGH)
  digitalWrite(LED_PLACA, LOW);
  Serial.println(F("[TRINCO] Fechadura trancada novamente."));
}

// CALLBACK MQTT: Tratamento direto do payload JSON do backend
void callbackMQTT(char* topic, byte* payload, unsigned int length) {
  JsonDocument doc; 
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    Serial.println(F("[MQTT] Erro ao interpretar JSON recebido."));
    return;
  }

  String comando = doc["cmd"] | "";

  // Destrava quando o backend dispara {"cmd": "UNLOCK"}
  if (comando == "UNLOCK") {
    Serial.println(F("[MQTT] Comando UNLOCK recebido com sucesso! Acionando trava..."));
    acionarTrinco();
  }
}

void publicarStatusOnline() {
  // Publica em devices/<deviceHash>/status
  String topicoStatusLigar = "devices/" + deviceHash + "/status";

  JsonDocument doc; 
  doc["isOnline"] = true;
  doc["deviceHash"] = deviceHash;
  doc["macAddress"] = macAddressStr;

  String payloadJson;
  serializeJson(doc, payloadJson);

  if (mqttClient.publish(topicoStatusLigar.c_str(), payloadJson.c_str(), true)) {
    Serial.printf("[MQTT] Status online publicado em: %s\n", topicoStatusLigar.c_str());
  } else {
    Serial.println(F("[MQTT] Falha ao publicar status online."));
  }
}

void reconectarMQTT() {
  static unsigned long ultimaTentativa = 0;
  if (millis() - ultimaTentativa > 5000) {
    ultimaTentativa = millis();
    Serial.print(F("Tentando conexão MQTT..."));
    String clientId = "ESP32Node-" + String(getEspChipId());

    // Last Will and Testament para registrar offline no Prisma
    String willTopic = "devices/" + deviceHash + "/status";
    String willPayload = "{\"isOnline\":false,\"deviceHash\":\"" + deviceHash + "\",\"macAddress\":\"" + macAddressStr + "\"}";

    const char* user = (strlen(mqtt_user) > 0) ? mqtt_user : NULL;
    const char* pass = (strlen(mqtt_pass) > 0) ? mqtt_pass : NULL;

    if (mqttClient.connect(clientId.c_str(), user, pass, willTopic.c_str(), 1, true, willPayload.c_str())) {
      Serial.println(F("conectado!"));
      
      // Normalização: garante exatamente uma barra entre a base e o Hash
      String baseTopic = String(mqtt_topic);
      if (!baseTopic.endsWith("/")) {
        baseTopic += "/";
      }
      String topicoInscricao = baseTopic + deviceHash;

      mqttClient.subscribe(topicoInscricao.c_str());
      Serial.printf("Inscrito no tópico de comando: %s\n", topicoInscricao.c_str());
      
      publicarStatusOnline();
    } else {
      Serial.printf("falha, rc=%d. Nova tentativa em 5s\n", mqttClient.state());
    }
  }
}

bool verificarAutenticacao() {
  if (modoAP) return true; 
  if (!server.authenticate(web_user, web_pass)) {
    server.requestAuthentication(DIGEST_AUTH, "Acesso Restrito Porta");
    return false;
  }
  return true;
}

void iniciarModoAP() {
  modoAP = true;
  WiFi.mode(WIFI_AP_STA); 
  String senhaAP = "ESP" + String(getEspChipId());
  WiFi.softAPConfig(IPAddress(192, 168, 4, 1), IPAddress(192, 168, 4, 1), IPAddress(255, 255, 255, 0));
  WiFi.softAP(autoconf_ssid.c_str(), senhaAP.c_str());
  dnsServer.start(DNS_PORT, "*", IPAddress(192, 168, 4, 1));
  Serial.print(F("Portal Ativo! Conecte em: ")); Serial.println(autoconf_ssid);
}

void handleCaptivePortal() {
  if (modoAP) {
    server.sendHeader(F("Location"), F("http://192.168.4.1/config"), true);
    server.send(302, "text/plain", ""); 
  } else {
    handleHome();
  }
}

void ChecarBotaoReset() {
  static unsigned long tempoBotao = 0;
  if (digitalRead(0) == LOW) {
    if (tempoBotao == 0) tempoBotao = millis();
    else if (millis() - tempoBotao > 3000) {
      Resetar();
    }
  } else {
    tempoBotao = 0;
  }
}

String gerarMenu() {
  return F("<h2><a href='/'>Inicio</a> | <a href='/config'>Configuração</a> | <a href='/senha'>Senha</a> | <a href='/padrao' onclick=\"return confirm('Resetar padrões?')\">Resetar</a> | <a href='/reboot' onclick=\"return confirm('Reiniciar?')\">Reiniciar</a></h2>");
}

void handleHome() {
  if (modoAP) {
    server.sendHeader(F("Location"), F("/config"), true);
    server.send(302, "text/plain", "");
    return;
  }
  if (!verificarAutenticacao()) return;

  String html = F("<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>Controle de Porta</title><link href='css' rel='stylesheet'></head><body><h1>Controle de Acesso</h1>");
  html += gerarMenu();
  html += F("<h3><table align='center'><tr><th colspan='2' class='msg'>Painel da Trava Magnética</th></tr>");
  html += F("<tr><td colspan='2' align='center' style='padding:20px;'>");
  html += F("<a href='/abrir' style='background:#4CAF50; color:white; padding:15px 30px; text-decoration:none; font-size:16px; font-weight:bold; border-radius:6px; display:inline-block;'>LIBERAR TRINCO</a>");
  html += F("</td></tr></table></h3></body></html>");
  server.send(200, "text/html", html);
}

void handleAbrirPortaLocal() {
  if (!verificarAutenticacao()) return; 

  acionarTrinco();
  String html = F("<html><head><meta charset='UTF-8'></head><body><h1 style='font-family:sans-serif; text-align:center; color:#4CAF50; margin-top:50px;'>Trinco Liberado com Sucesso!</h1><script>setTimeout(function(){ window.location.href = '/'; }, 2000);</script></body></html>");
  server.send(200, "text/html", html);
}

void handleConfig() {
  if (!verificarAutenticacao()) return; 

  String info = F("<p>#Prog# Versão: #V# Data: #D#<br>ID: #ID#<br>Hash Automático: #HASH#<br>Wi-Fi Conectado: #WF#<br>MAC: #MC#<br>IP Atual: #IP_ACT#</p>");
  info.replace("#Prog#", NomePrograma); info.replace("#V#", Ver); info.replace("#D#", DataVer);
  info.replace("#HASH#", deviceHash); info.replace("#MC#", macAddressStr); info.replace("#ID#", autoconf_ssid); 
  info.replace("#WF#", WiFi.SSID()); info.replace("#IP_ACT#", WiFi.localIP().toString());

  int n = WiFi.scanNetworks();
  String redesHtml = "";
  if (n == 0) {
    redesHtml = F("<p style='color:red;'>Nenhuma rede encontrada</p>");
  } else {
    redesHtml = F("<select id='listaRedes' onchange='document.getElementById(\"inputSSID\").value=this.value'><option value=''>-- Selecione uma rede encontrada --</option>");
    for (int i = 0; i < n; ++i) {
      redesHtml += "<option value='" + WiFi.SSID(i) + "'>" + WiFi.SSID(i) + " (" + String(WiFi.RSSI(i)) + " dBm)</option>";
    }
    redesHtml += F("</select>");
  }

  String html = F("<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>Config</title><link href='/css' rel='stylesheet'>");
  html += F("<script>function toggleIPFields(){var d=document.getElementById('dhcpCheck').checked;document.getElementById('ipF').disabled=d;document.getElementById('gwF').disabled=d;document.getElementById('smF').disabled=d;document.getElementById('dnsF').disabled=d;}</script>");
  html += F("</head><body onload='toggleIPFields()'><h1>Configurações</h1>");
  html += gerarMenu(); 
  html += F("<h3><form action='save' method='post'><table><tr><th colspan='2' class=\"msg\">Informações</th></tr><tr><td colspan='2' align='center'>");
  html += info;
  html += F("</td></tr><tr><th colspan='2' class=\"msg\">Configurações de Rede</th></tr>");
  html += "<tr><td>Redes próximas:</td><td>" + redesHtml + "</td></tr>";
  html += "<tr><td>WIFI SSID:</td><td><input type='text' id='inputSSID' name='ssid' value='" + String(ssid) + "'></td></tr>";
  html += "<tr><td>WIFI SENHA:</td><td><input type='password' id='inputPass' name='password' value='" + String(password) + "'><br><label style='font-size:10px; color:#555; display:inline-block; margin-top:5px;'><input type='checkbox' style='width:auto; margin-right:5px;' onclick='var x=document.getElementById(\"inputPass\"); if(x.type===\"password\"){x.type=\"text\"}else{x.type=\"password\"}'>Mostrar senha</label></td></tr>";

  String dhcpChecked = usa_dhcp ? "checked" : "";
  html += "<tr><td>USAR DHCP:</td><td><input type='checkbox' id='dhcpCheck' name='dhcp' value='1' " + dhcpChecked + " onclick='toggleIPFields()' style='width:auto;'> <span style='font-size:11px; color:#555;'>Obter IP automaticamente</span></td></tr>";

  html += F("<tr><th colspan='2' class=\"msg\">Configurações MQTT</th></tr>");
  auto addRow = [](String label, String name, String val, String idField) {
    return "<tr><td>" + label + ":</td><td><input type='text' id='" + idField + "' name='" + name + "' value='" + val + "'></td></tr>";
  };

  html += addRow("BROKER URL / HOST", "api_host", api_host, "hostF"); 
  html += addRow("BROKER PORT", "api_port", api_port, "portF");
  html += addRow("USUÁRIO MQTT", "mqtt_user", mqtt_user, "userF");
  html += "<tr><td>SENHA MQTT:</td><td><input type='password' id='passF' name='mqtt_pass' value='" + String(mqtt_pass) + "'><br><label style='font-size:10px; color:#555; display:inline-block; margin-top:5px;'><input type='checkbox' style='width:auto; margin-right:5px;' onclick='var x=document.getElementById(\"passF\"); if(x.type===\"password\"){x.type=\"text\"}else{x.type=\"password\"}'>Mostrar senha</label></td></tr>";
  html += addRow("TÓPICO BASE MQTT", "mqtt_topic", mqtt_topic, "topF"); 

  html += F("<tr><th colspan='2' class=\"msg\">Endereçamento IP (Caso IP Fixo)</th></tr>");
  html += addRow("IP ESTÁTICO", "staticIP", static_ip, "ipF"); 
  html += addRow("GATEWAY", "gatewayIP", static_gw, "gwF");
  html += addRow("MÁSCARA", "subnetMask", static_sn, "smF"); 
  html += addRow("DNS", "dnsIP", static_dns, "dnsF");

  html += F("</table><input type='submit' value='Salvar Configurações'></form></h3></body></html>");
  server.send(200, "text/html", html);
}

void handleSenha() {
  if (!verificarAutenticacao()) return; 

  String html = F("<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>Alterar Senha</title><link href='/css' rel='stylesheet'></head><body><h1>Segurança do Sistema</h1>");
  html += gerarMenu();
  html += F("<h3><form action='/senhasave' method='post'><table><tr><th colspan='2' class=\"msg\">Alterar Dados de Login</th></tr>");
  html += "<tr><td>Novo Usuário:</td><td><input type='text' name='new_user' value='";
  html += String(web_user) + "'></td></tr>";
  html += "<tr><td>Nova Senha:</td><td><input type='password' id='newPass' name='new_pass' value='";
  html += String(web_pass) + "'><br><label style='font-size:10px; color:#555; display:inline-block; margin-top:5px;'><input type='checkbox' style='width:auto; margin-right:5px;' onclick='var x=document.getElementById(\"newPass\"); if(x.type===\"password\"){x.type=\"text\"}else{x.type=\"password\"}'>Mostrar senha</label></td></tr>";
  html += F("</table><input type='submit' value='Salvar Dados'></form></h3></body></html>");
  server.send(200, "text/html", html);
}

void handleSenhaSave() {
  if (!verificarAutenticacao()) return;
  if (server.method() == HTTP_POST) {
    if (server.hasArg("new_user")) {
      String val = server.arg("new_user");
      if (val.length() > 0) strcpy(web_user, val.c_str());
    }
    if (server.hasArg("new_pass")) {
      String val = server.arg("new_pass");
      if (val.length() > 0) strcpy(web_pass, val.c_str());
    }
    salvarConfigFS();
  }
  String rHtml = F("<html><head><meta charset='UTF-8'></head><body><h1 style='font-family:sans-serif; text-align:center; color:#3c99ea; margin-top:50px;'>Dados Alterados!</h1><p style='text-align:center;'>Use suas novas credenciais no próximo acesso.</p><script>setTimeout(function(){ window.location.href = '/config'; }, 2000);</script></body></html>");
  server.send(200, "text/html", rHtml);
}

void handleConfigSave() {
  if (!verificarAutenticacao()) return;

  if (server.hasArg("ssid")) strcpy(ssid, server.arg("ssid").c_str());
  if (server.hasArg("password")) strcpy(password, server.arg("password").c_str());
  usa_dhcp = server.hasArg("dhcp");
  strcpy(static_ip, server.arg("staticIP").c_str());
  strcpy(static_gw, server.arg("gatewayIP").c_str());
  strcpy(static_sn, server.arg("subnetMask").c_str());
  strcpy(static_dns, server.arg("dnsIP").c_str());

  strcpy(api_host, server.arg("api_host").c_str());
  strcpy(api_port, server.arg("api_port").c_str());
  if (server.hasArg("mqtt_user")) strcpy(mqtt_user, server.arg("mqtt_user").c_str());
  if (server.hasArg("mqtt_pass")) strcpy(mqtt_pass, server.arg("mqtt_pass").c_str());
  strcpy(mqtt_topic, server.arg("mqtt_topic").c_str());

  salvarConfigFS();

  String redirectHtml = F("<html><head><meta charset='UTF-8'></head><body><h1 style='font-family:sans-serif; text-align:center; color:#3c99ea; margin-top:50px;'>Configurações salvas com sucesso!</h1><p style='font-family:sans-serif; text-align:center; color:#666;'>O dispositivo está reiniciando para aplicar as novas configurações.<br>Redirecionando...</p><script>setTimeout(function(){ window.location.href = window.location.origin + '/'; }, 5000);</script></body></html>");
  server.send(200, "text/html", redirectHtml);
  delay(1000); 
  ESP.restart();
}

void Resetar() {
  Serial.println(F("Limpando configurações locais, resetando credenciais e ativando modo AP..."));
  SPIFFS.remove(configFilePath);

  memset(ssid, 0, sizeof(ssid));
  memset(password, 0, sizeof(password));
  memset(mqtt_user, 0, sizeof(mqtt_user));
  memset(mqtt_pass, 0, sizeof(mqtt_pass));
  strcpy(web_user, "admin"); 
  strcpy(web_pass, "admin"); 
  WiFi.disconnect(true); 

  if (server.client()) {
    server.send(200, "text/html", F("<html><head><meta charset='UTF-8'></head><body><h1>Equipamento Resetado! Entre no modo AP para configurar...</h1></body></html>"));
    delay(500);
  }
  iniciarModoAP();
}

void Reboot() {
  if (!verificarAutenticacao()) return;

  String redirectHtml = F("<html><head><meta charset='UTF-8'></head><body><h1 style='font-family:sans-serif; text-align:center; color:#3c99ea; margin-top:50px;'>Reiniciando módulo...</h1><p style='font-family:sans-serif; text-align:center; color:#666;'>Aguarde enquanto a placa reconecta.<br>Redirecionando...</p><script>setTimeout(function(){ window.location.href = window.location.origin + '/'; }, 5000);</script></body></html>");
  server.send(200, "text/html", redirectHtml);
  delay(1000); 
  ESP.restart();
}

void carregarConfigFS() {
  if (SPIFFS.begin(true) && SPIFFS.exists(configFilePath)) {
    File f = SPIFFS.open(configFilePath, "r");
    if (f) {
      JsonDocument json; 
      DeserializationError error = deserializeJson(json, f);
      if (!error) {
        if (json["ssid"].is<const char*>()) strcpy(ssid, json["ssid"]);
        if (json["password"].is<const char*>()) strcpy(password, json["password"]);
        if (json["api_host"].is<const char*>()) strcpy(api_host, json["api_host"]);
        if (json["api_port"].is<const char*>()) strcpy(api_port, json["api_port"]);
        if (json["mqtt_user"].is<const char*>()) strcpy(mqtt_user, json["mqtt_user"]);
        if (json["mqtt_pass"].is<const char*>()) strcpy(mqtt_pass, json["mqtt_pass"]);
        if (json["mqtt_topic"].is<const char*>()) strcpy(mqtt_topic, json["mqtt_topic"]);
        if (json["dhcp"].is<bool>()) usa_dhcp = json["dhcp"].as<bool>();

        if (json["w_user"].is<const char*>()) strcpy(web_user, json["w_user"]);
        if (json["w_pass"].is<const char*>()) strcpy(web_pass, json["w_pass"]);
        
        if (json["ip"].is<const char*>()) {
          strcpy(static_ip, json["ip"]); 
          strcpy(static_gw, json["gateway"]);
          strcpy(static_sn, json["subnet"]); 
          strcpy(static_dns, json["dns"]);
        }
      }
      f.close();
    }
  }
}

void salvarConfigFS() {
  JsonDocument json; 
  json["ssid"] = ssid;
  json["password"] = password;
  json["api_host"] = api_host; 
  json["api_port"] = api_port;
  json["mqtt_user"] = mqtt_user;
  json["mqtt_pass"] = mqtt_pass;
  json["mqtt_topic"] = mqtt_topic;
  json["dhcp"] = usa_dhcp; 
  json["ip"] = static_ip; 
  json["gateway"] = static_gw;
  json["subnet"] = static_sn; 
  json["dns"] = static_dns;

  json["w_user"] = web_user;
  json["w_pass"] = web_pass;

  File f = SPIFFS.open(configFilePath, "w");
  if (f) { 
    serializeJson(json, f); 
    f.close(); 
  }
}

void handleCSS() {
  server.send(200, "text/css", F("body {font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 12px; color: #ffffff; margin: 0 auto; background: #d0d0d0; min-width: 80%; max-width: 80%;} h1 {font-size: 18px; text-align: center; color: rgb(60, 153, 234); background: #787878; border-radius: 7px 7px 0px 0px; padding: 7px 4px 0px 4px; margin: 0px;} h2 {text-align: center; font-size: 12px; color: rgb(60, 153, 234); background: #787878; padding: 4px 8px 4px 8px; margin: 0px; border: #787878 solid 2px;} h3 {font-size: 12px; text-align: left; font-weight: normal; background: #ffffff; padding: 7px; margin: 0px; border: #787878 solid 2px; border-radius: 0px 0px 7px 7px;} table {width: 100%;} th {font-size: 11px; background: rgb(60, 153, 234); text-align: center; padding: 5px; border-radius: 3px 0px 0px 3px; width: 5%;} td {font-size: 11px; background: #787878; padding: 5px; border-radius: 0px 3px 3px 0px;} a {font-size: 12px; color: #ffffff;} select {width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #787878;} input[type=submit] {border: 2px solid #333333; border-radius: 5px; padding: 5px; width: 150px; background: rgb(60, 153, 234); color: white; font-weight: bold; cursor:pointer;} input {width: 100%;} .msg {font-size: 14px; text-align: center; padding: 5px; border-radius: 3px;}"));
}
