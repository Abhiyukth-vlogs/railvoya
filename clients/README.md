# RailVoya Multi-Language Client SDKs & Integration Examples

This directory provides working client integration examples for the RailVoya Indian Railways API in **HTML/CSS**, **JavaScript (Node.js & Browser)**, **Java**, and **C++**.

---

## 1. Vanilla HTML & CSS (`clients/html-css/`)
A responsive embeddable train search and live PNR widget built with clean HTML5 and Vanilla CSS without external frameworks.
- Open `clients/html-css/index.html` in any browser:
  ```bash
  # Start local web server or open directly
  start clients/html-css/index.html
  ```

---

## 2. JavaScript / Node.js (`clients/javascript/railvoya_client.js`)
Works in Node.js (v18+) and modern browsers using native `fetch`.
- **Run the demo directly:**
  ```bash
  node clients/javascript/railvoya_client.js
  ```
- **Example Usage:**
  ```javascript
  const { RailVoyaClient } = require('./railvoya_client');
  const client = new RailVoyaClient('http://127.0.0.1:8000/api/v1');

  // Search trains
  const trains = await client.searchTrains({
    origin: 'NDLS',
    destination: 'BPL',
    date: '2026-09-26',
    quota: 'GN'
  });

  // Check 10-digit PNR
  const pnr = await client.getPnrStatus('2458910243');
  console.log(pnr.chart_status, pnr.passengers);
  ```

---

## 3. Java 11+ (`clients/java/RailVoyaClient.java`)
Zero-dependency client using Java's built-in `java.net.http.HttpClient`.
- **Compile and Run:**
  ```bash
  # Compile
  javac clients/java/RailVoyaClient.java

  # Run
  java -cp . clients.java.RailVoyaClient
  ```

---

## 4. C++17 (`clients/cpp/railvoya_client.cpp`)
High-performance native client using `libcurl`.
- **Compile and Run:**
  ```bash
  # Linux / macOS
  g++ -std=c++17 clients/cpp/railvoya_client.cpp -lcurl -o railvoya_client
  ./railvoya_client

  # Windows (MinGW)
  g++ -std=c++17 clients/cpp/railvoya_client.cpp -lcurl -o railvoya_client.exe
  ./railvoya_client.exe
  ```

---

## 5. cURL REST Endpoints
```bash
# 1. Search Trains (NDLS to BPL)
curl -X GET "http://127.0.0.1:8000/api/v1/trains/search?origin=NDLS&destination=BPL&journey_date=2026-09-26&quota=GN"

# 2. Check 10-Digit PNR Status
curl -X GET "http://127.0.0.1:8000/api/v1/pnr/2458910243"

# 3. Live Satellite Radar Tracking
curl -X GET "http://127.0.0.1:8000/api/v1/running-status/20901"
```
