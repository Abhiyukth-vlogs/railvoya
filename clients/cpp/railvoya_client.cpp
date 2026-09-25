/**
 * RailVoya C++ API Client (C++17 / libcurl)
 * High-performance native Indian Railways integration client.
 *
 * Compilation:
 *   Linux/macOS: g++ -std=c++17 railvoya_client.cpp -lcurl -o railvoya_client
 *   Windows MSVC: cl /EHsc /std:c++17 railvoya_client.cpp libcurl.lib
 *   Windows MinGW: g++ -std=c++17 railvoya_client.cpp -lcurl -o railvoya_client.exe
 */

#include <iostream>
#include <string>
#include <curl/curl.h>

class RailVoyaClient {
private:
    std::string baseUrl;

    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
        size_t totalSize = size * nmemb;
        std::string* mem = static_cast<std::string*>(userp);
        mem->append(static_cast<char*>(contents), totalSize);
        return totalSize;
    }

    std::string httpGet(const std::string& url) {
        CURL* curl = curl_easy_init();
        std::string readBuffer;

        if (curl) {
            curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
            curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
            curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
            curl_easy_setopt(curl, CURLOPT_USERAGENT, "RailVoya-CPP-Client/1.0");
            curl_easy_setopt(curl, CURLOPT_TIMEOUT, 15L);

            CURLcode res = curl_easy_perform(curl);
            if (res != CURLE_OK) {
                std::string err = curl_easy_strerror(res);
                curl_easy_cleanup(curl);
                throw std::runtime_error("CURL request failed: " + err);
            }

            long httpCode = 0;
            curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
            curl_easy_cleanup(curl);

            if (httpCode >= 400) {
                throw std::runtime_error("HTTP Error " + std::to_string(httpCode) + ": " + readBuffer);
            }
        }
        return readBuffer;
    }

public:
    RailVoyaClient(const std::string& base = "http://127.0.0.1:8000/api/v1") : baseUrl(base) {
        curl_global_init(CURL_GLOBAL_DEFAULT);
    }

    ~RailVoyaClient() {
        curl_global_cleanup();
    }

    /**
     * Search trains between stations
     */
    std::string searchTrains(const std::string& origin, const std::string& destination, const std::string& date, const std::string& quota = "GN") {
        std::string url = baseUrl + "/trains/search?origin=" + origin + "&destination=" + destination + "&journey_date=" + date + "&quota=" + quota;
        return httpGet(url);
    }

    /**
     * Check 10-digit Indian Railways PNR status
     */
    std::string getPnrStatus(const std::string& pnrNumber) {
        std::string url = baseUrl + "/pnr/" + pnrNumber;
        return httpGet(url);
    }

    /**
     * Get Live Satellite Radar & RTIS Running Status
     */
    std::string getRunningStatus(const std::string& trainNumber) {
        std::string url = baseUrl + "/running-status/" + trainNumber;
        return httpGet(url);
    }

    /**
     * Get Official IRCTC Fast-Track Portal URL
     */
    std::string getOfficialIrctcUrl() {
        return "https://www.irctc.co.in/nget/train-search";
    }
};

int main() {
    std::cout << "============================================" << std::endl;
    std::cout << "     RailVoya C++ Native Client (libcurl)   " << std::endl;
    std::cout << "============================================" << std::endl;

    try {
        RailVoyaClient client;

        std::cout << "\n[1] Querying Train Search API (NDLS -> BPL)..." << std::endl;
        std::string trains = client.searchTrains("NDLS", "BPL", "2026-09-26", "GN");
        std::cout << "Received: " << trains.substr(0, std::min<size_t>(200, trains.length())) << "... [truncated]" << std::endl;

        std::cout << "\n[2] Querying CRIS PNR Status (2458910243)..." << std::endl;
        std::string pnr = client.getPnrStatus("2458910243");
        std::cout << "Received: " << pnr.substr(0, std::min<size_t>(200, pnr.length())) << "... [truncated]" << std::endl;

        std::cout << "\n[3] Official IRCTC Direct Connect Gateway:" << std::endl;
        std::cout << client.getOfficialIrctcUrl() << std::endl;

        std::cout << "\n>> C++ Client Execution Completed Successfully!" << std::endl;
    } catch (const std::exception& ex) {
        std::cerr << "Error: " << ex.what() << std::endl;
        return 1;
    }

    return 0;
}
