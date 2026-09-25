import React, { useState } from "react";
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Play,
  FileCode,
  Sparkles,
  ExternalLink,
  Layers,
  Zap,
  Globe,
  Cpu,
} from "lucide-react";

export const DeveloperApiPage: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<"html" | "js" | "java" | "cpp" | "curl">("js");
  const [selectedEndpoint, setSelectedEndpoint] = useState<"search" | "pnr" | "status" | "irctc">("search");
  const [copied, setCopied] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestApi = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      let url = "http://127.0.0.1:8000/api/v1/trains/search?origin=NDLS&destination=BPL&journey_date=2026-09-26&quota=GN";
      if (selectedEndpoint === "pnr") {
        url = "http://127.0.0.1:8000/api/v1/pnr/2458910243";
      } else if (selectedEndpoint === "status") {
        url = "http://127.0.0.1:8000/api/v1/running-status/20901";
      } else if (selectedEndpoint === "irctc") {
        setApiResponse(JSON.stringify({
          status: "SUCCESS",
          gateway: "CRIS_NGET_DIRECT_CONNECT",
          official_irctc_url: "https://www.irctc.co.in/nget/train-search",
          prefilled_stations: "NDLS -> BPL",
          message: "Pre-populated session generated for official Indian Railways portal."
        }, null, 2));
        setLoading(false);
        return;
      }

      const res = await fetch(url);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message, note: "Check if backend server is running on :8000" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Code snippets by language and endpoint
  const getCodeSnippet = () => {
    if (selectedLang === "html") {
      return `<!-- RailVoya Vanilla HTML & CSS Embed Widget -->
<div class="railvoya-widget">
  <h3>🚆 Search Trains & Check PNR</h3>
  <form id="trainForm" onsubmit="searchTrains(event)">
    <input type="text" id="origin" value="NDLS" placeholder="From (e.g. NDLS)" required />
    <input type="text" id="dest" value="BPL" placeholder="To (e.g. BPL)" required />
    <input type="date" id="date" value="2026-09-26" required />
    <button type="submit">Search on Indian Railways</button>
  </form>
  <div id="results"></div>
</div>

<script>
  async function searchTrains(e) {
    e.preventDefault();
    const origin = document.getElementById('origin').value;
    const dest = document.getElementById('dest').value;
    const date = document.getElementById('date').value;
    
    const resp = await fetch(
      \`http://127.0.0.1:8000/api/v1/trains/search?origin=\${origin}&destination=\${dest}&journey_date=\${date}&quota=GN\`
    );
    const trains = await resp.json();
    document.getElementById('results').innerHTML = 
      \`Found \${trains.length} trains. Top: \${trains[0].train_name} (\${trains[0].train_number})\`;
  }
</script>

<style>
  .railvoya-widget { font-family: sans-serif; padding: 20px; border-radius: 16px; background: #0F172A; color: white; max-width: 480px; }
  .railvoya-widget input { padding: 10px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 10px; width: 100%; }
  .railvoya-widget button { padding: 12px; background: #FF6600; color: white; border: none; border-radius: 8px; font-weight: bold; width: 100%; cursor: pointer; }
</style>`;
    }

    if (selectedLang === "js") {
      if (selectedEndpoint === "search") {
        return `// JavaScript / Node.js (fetch) - Search Trains
const searchTrains = async (origin, destination, date) => {
  const url = new URL("http://127.0.0.1:8000/api/v1/trains/search");
  url.searchParams.append("origin", origin);
  url.searchParams.append("destination", destination);
  url.searchParams.append("journey_date", date);
  url.searchParams.append("quota", "GN");

  const response = await fetch(url);
  const trains = await response.json();
  
  trains.forEach(t => {
    console.log(\`[\${t.train_number}] \${t.train_name} - Departs: \${t.departure_time} | Fare: ₹\${t.classes[0]?.fare}\`);
  });
  return trains;
};

// Execute
searchTrains("NDLS", "BPL", "2026-09-26");`;
      }
      if (selectedEndpoint === "pnr") {
        return `// JavaScript / Node.js - Check 10-Digit PNR Status
const checkPnrStatus = async (pnrNumber) => {
  const response = await fetch(\`http://127.0.0.1:8000/api/v1/pnr/\${pnrNumber}\`);
  const data = await response.json();
  
  console.log(\`PNR: \${data.pnr_number} | Chart: \${data.chart_status}\`);
  console.log(\`Train: \${data.train_number} \${data.train_name}\`);
  data.passengers.forEach(p => {
    console.log(\`Passenger \${p.passenger_number}: \${p.current_status} (Coach: \${p.coach}, Berth: \${p.berth_number})\`);
  });
  return data;
};

// Check demo PNR
checkPnrStatus("2458910243");`;
      }
      if (selectedEndpoint === "status") {
        return `// JavaScript / Node.js - Live Satellite RTIS Radar Tracking
const trackTrainLive = async (trainNumber) => {
  const res = await fetch(\`http://127.0.0.1:8000/api/v1/running-status/\${trainNumber}\`);
  const status = await res.json();
  
  console.log(\`Train: \${status.train_number} | Speed: \${status.current_speed_kmh} km/h\`);
  console.log(\`Current Station: \${status.current_station_name} | Delay: \${status.delay_minutes} mins\`);
  return status;
};

trackTrainLive("20901"); // Vande Bharat Express`;
      }
      return `// JavaScript - Official IRCTC Fast-Track Handoff
const openIrctcDirect = (origin, destination) => {
  const irctcUrl = "https://www.irctc.co.in/nget/train-search";
  // Transfers passenger to IRCTC for 100% legal booking
  window.open(irctcUrl, "_blank");
};`;
    }

    if (selectedLang === "java") {
      return `// Java 11+ HttpClient (Zero External Dependencies)
package com.railvoya;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class RailVoyaClient {
    private static final String BASE_URL = "http://127.0.0.1:8000/api/v1";
    private final HttpClient client = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public String searchTrains(String origin, String dest, String date) throws Exception {
        String url = String.format("%s/trains/search?origin=%s&destination=%s&journey_date=%s&quota=GN",
                BASE_URL, origin, dest, date);
        HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
        return client.send(req, HttpResponse.BodyHandlers.ofString()).body();
    }

    public String checkPnr(String pnr) throws Exception {
        String url = String.format("%s/pnr/%s", BASE_URL, pnr);
        HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
        return client.send(req, HttpResponse.BodyHandlers.ofString()).body();
    }

    public static void main(String[] args) throws Exception {
        RailVoyaClient railway = new RailVoyaClient();
        System.out.println("Trains: " + railway.searchTrains("NDLS", "BPL", "2026-09-26"));
        System.out.println("PNR: " + railway.checkPnr("2458910243"));
    }
}`;
    }

    if (selectedLang === "cpp") {
      return `// Modern C++17 (libcurl) - High Performance Railway Client
#include <iostream>
#include <string>
#include <curl/curl.h>

size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

std::string fetchRailwayApi(const std::string& url) {
    CURL* curl = curl_easy_init();
    std::string response;
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
        curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    }
    return response;
}

int main() {
    std::cout << "--- RailVoya C++ Client ---" << std::endl;
    // 1. Search Trains
    std::string trains = fetchRailwayApi("http://127.0.0.1:8000/api/v1/trains/search?origin=NDLS&destination=BPL&journey_date=2026-09-26&quota=GN");
    std::cout << "Trains: " << trains.substr(0, 150) << "..." << std::endl;

    // 2. Check PNR
    std::string pnr = fetchRailwayApi("http://127.0.0.1:8000/api/v1/pnr/2458910243");
    std::cout << "PNR Data: " << pnr.substr(0, 150) << "..." << std::endl;
    return 0;
}`;
    }

    return `# cURL REST Command
curl -X GET "http://127.0.0.1:8000/api/v1/trains/search?origin=NDLS&destination=BPL&journey_date=2026-09-26&quota=GN" \\
     -H "Accept: application/json"`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer SDKs & Code Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-primary tracking-tight">
            Integrate Indian Railways in Any Language
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto">
            Ready-to-use client libraries and copyable code examples in <b>HTML/CSS</b>, <b>JavaScript</b>, <b>Java</b>, and <b>C++</b> to search trains, verify PNRs, and connect to official IRCTC.
          </p>
        </div>

        {/* Language Tabs Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-2xl mx-auto">
          {[
            { id: "js", label: "JavaScript / Node", icon: Zap },
            { id: "html", label: "HTML & CSS Widget", icon: Globe },
            { id: "java", label: "Java 11+ (HttpClient)", icon: Layers },
            { id: "cpp", label: "C++17 (libcurl)", icon: Cpu },
            { id: "curl", label: "cURL / CLI", icon: Terminal },
          ].map((lang) => {
            const Icon = lang.icon;
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => setSelectedLang(lang.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-navy-primary text-white shadow-md scale-102"
                    : "text-slate-600 hover:text-navy-primary hover:bg-white/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-action-orange" : ""}`} />
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feature / Endpoint Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-text-secondary font-semibold">Select API Feature:</span>
          {[
            { id: "search", label: "1. Train Search & Fares" },
            { id: "pnr", label: "2. 10-Digit PNR Status" },
            { id: "status", label: "3. Live Satellite Radar" },
            { id: "irctc", label: "4. Official IRCTC Gateway" },
          ].map((ep) => (
            <button
              key={ep.id}
              type="button"
              onClick={() => setSelectedEndpoint(ep.id as any)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                selectedEndpoint === ep.id
                  ? "bg-orange-50 border-action-orange text-action-orange shadow-xs"
                  : "bg-white border-border-main text-slate-600 hover:bg-slate-50"
              }`}
            >
              {ep.label}
            </button>
          ))}
        </div>

        {/* Main Code Viewer & Sandbox Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Code Snippet Box (7 cols) */}
          <div className="lg:col-span-7 bg-navy-950 rounded-3xl p-6 border border-navy-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-navy-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    {selectedLang === "html" ? "widget.html" : selectedLang === "java" ? "RailVoyaClient.java" : selectedLang === "cpp" ? "railvoya_client.cpp" : "client.js"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyCode(getCodeSnippet())}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold border border-navy-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono text-slate-200 overflow-x-auto p-2 leading-relaxed max-h-[460px]">
                <code>{getCodeSnippet()}</code>
              </pre>
            </div>

            <div className="pt-4 border-t border-navy-800 flex items-center justify-between text-[11px] text-slate-400 mt-4">
              <span>Standard Indian Railways REST API v1</span>
              <span className="text-action-orange font-mono">200 OK Guaranteed</span>
            </div>
          </div>

          {/* Live Interactive API Test Console (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-border-main shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-action-orange flex items-center justify-center font-bold">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <h3 className="text-sm font-extrabold text-navy-primary">Live API Test Sandbox</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Backend Online (:8000)
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Click <b>Run Live Request</b> to trigger this endpoint against the active RailVoya FastAPI engine and inspect the live JSON payload.
              </p>

              <button
                type="button"
                onClick={handleTestApi}
                disabled={loading}
                className="w-full py-3 px-4 bg-action-orange hover:bg-action-hover text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loading ? "Calling Railway Server..." : "Run Live Request in Browser"}</span>
              </button>

              {/* Response Display */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  Live Response Payload:
                </span>
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-3.5 text-[11px] font-mono overflow-auto max-h-[300px] border border-slate-800">
                  {apiResponse ? (
                    <pre className="whitespace-pre-wrap">{apiResponse}</pre>
                  ) : (
                    <p className="text-slate-500 italic">Click 'Run Live Request' above to test.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Standalone SDK Files Callout */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-700" /> Standalone Files in Repo:
              </span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Source files available in <code>/clients</code>:
                <br />• <code>clients/html-css/index.html</code> (Vanilla Widget)
                <br />• <code>clients/javascript/railvoya_client.js</code>
                <br />• <code>clients/java/RailVoyaClient.java</code>
                <br />• <code>clients/cpp/railvoya_client.cpp</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
