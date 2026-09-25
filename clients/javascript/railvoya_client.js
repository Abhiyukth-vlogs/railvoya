/**
 * RailVoya JavaScript / Node.js API Client
 * Works in Node.js (v18+) and modern Browsers
 */

class RailVoyaClient {
  constructor(baseUrl = "http://127.0.0.1:8000/api/v1") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Search available trains between two stations
   * @param {Object} options
   * @param {string} options.origin - 3-4 letter IR station code (e.g. 'NDLS')
   * @param {string} options.destination - 3-4 letter station code (e.g. 'BPL')
   * @param {string} options.date - Date in YYYY-MM-DD
   * @param {string} [options.quota='GN'] - Quota code (GN, TQ, LD, SS)
   */
  async searchTrains({ origin, destination, date, quota = "GN" }) {
    const params = new URLSearchParams({
      origin,
      destination,
      journey_date: date,
      quota,
    });
    const response = await fetch(`${this.baseUrl}/trains/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Check 10-Digit PNR Status & Berth Allocation
   * @param {string} pnrNumber - 10-digit Indian Railways PNR
   */
  async getPnrStatus(pnrNumber) {
    const response = await fetch(`${this.baseUrl}/pnr/${encodeURIComponent(pnrNumber)}`);
    if (!response.ok) {
      throw new Error(`PNR check failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Check Live Satellite Radar & RTIS Running Status
   * @param {string} trainNumber - 5-digit train number (e.g. '20901')
   * @param {string} [journeyDate] - Date in YYYY-MM-DD
   */
  async getRunningStatus(trainNumber, journeyDate) {
    const query = journeyDate ? `?journey_date=${encodeURIComponent(journeyDate)}` : "";
    const response = await fetch(`${this.baseUrl}/running-status/${encodeURIComponent(trainNumber)}${query}`);
    if (!response.ok) {
      throw new Error(`Running status failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Generate official IRCTC Fast-Track Handoff URL
   */
  getOfficialIrctcHandoff() {
    return "https://www.irctc.co.in/nget/train-search";
  }
}

// Export for Node.js CommonJS & ESM
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RailVoyaClient };
}

// Example Execution when run directly via `node railvoya_client.js`
if (typeof require !== "undefined" && require.main === module) {
  (async () => {
    console.log("=== RailVoya JavaScript API Client Demo ===");
    const client = new RailVoyaClient();

    try {
      console.log("\n1. Searching Trains (NDLS ➔ BPL)...");
      const searchRes = await client.searchTrains({
        origin: "NDLS",
        destination: "BPL",
        date: new Date().toISOString().split("T")[0],
        quota: "GN",
      });
      const trains = Array.isArray(searchRes) ? searchRes : (searchRes.trains || []);
      console.log(`Found ${trains.length} trains.`);
      trains.slice(0, 2).forEach((t) => {
        console.log(`- ${t.train_number} ${t.train_name} (${t.departure_time} ➔ ${t.arrival_time})`);
      });

      console.log("\n2. Checking Live PNR (2458910243)...");
      const pnrRes = await client.getPnrStatus("2458910243");
      console.log(`PNR: ${pnrRes.pnr_number} | Train: ${pnrRes.train_number} | Status: ${pnrRes.chart_status}`);
      console.log(`Coach: ${pnrRes.passengers[0].coach}, Berth: ${pnrRes.passengers[0].berth_number}`);

      console.log("\n3. Official IRCTC Link:");
      console.log(client.getOfficialIrctcHandoff());
    } catch (err) {
      console.error("API Error:", err.message);
    }
  })();
}
