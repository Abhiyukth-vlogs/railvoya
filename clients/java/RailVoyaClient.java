package clients.java;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.Duration;

/**
 * RailVoya Java API Client
 * Enterprise Indian Railways integration client written in Modern Java (Java 11+)
 * Uses built-in java.net.http.HttpClient (Zero external dependencies).
 */
public class RailVoyaClient {

    private final String baseUrl;
    private final HttpClient httpClient;

    public RailVoyaClient() {
        this("http://127.0.0.1:8000/api/v1");
    }

    public RailVoyaClient(String baseUrl) {
        this.baseUrl = baseUrl.replaceAll("/$", "");
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Search available trains between two railway stations
     *
     * @param origin      Origin station code (e.g. "NDLS")
     * @param destination Destination station code (e.g. "BPL")
     * @param journeyDate Date in YYYY-MM-DD
     * @param quota       Quota code ("GN", "TQ", "LD", "SS")
     * @return JSON String of train search results
     */
    public String searchTrains(String origin, String destination, String journeyDate, String quota)
            throws IOException, InterruptedException {
        String endpoint = String.format("%s/trains/search?origin=%s&destination=%s&journey_date=%s&quota=%s",
                this.baseUrl,
                urlEncode(origin),
                urlEncode(destination),
                urlEncode(journeyDate),
                urlEncode(quota != null ? quota : "GN"));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(15))
                .header("Accept", "application/json")
                .header("User-Agent", "RailVoya-Java-SDK/1.0")
                .GET()
                .build();

        HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new RuntimeException("HTTP Error " + response.statusCode() + ": " + response.body());
        }
        return response.body();
    }

    /**
     * Check 10-digit Indian Railways PNR Status & Berth Allocation
     *
     * @param pnrNumber 10-digit PNR
     * @return JSON String with PNR status
     */
    public String getPnrStatus(String pnrNumber) throws IOException, InterruptedException {
        String endpoint = String.format("%s/pnr/%s", this.baseUrl, urlEncode(pnrNumber));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(15))
                .header("Accept", "application/json")
                .header("User-Agent", "RailVoya-Java-SDK/1.0")
                .GET()
                .build();

        HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new RuntimeException("HTTP Error " + response.statusCode() + ": " + response.body());
        }
        return response.body();
    }

    /**
     * Get Live Satellite Radar & RTIS GPS Running Status
     *
     * @param trainNumber 5-digit train number (e.g. "20901")
     * @return JSON String with running status
     */
    public String getRunningStatus(String trainNumber) throws IOException, InterruptedException {
        String endpoint = String.format("%s/running-status/%s", this.baseUrl, urlEncode(trainNumber));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(15))
                .header("Accept", "application/json")
                .header("User-Agent", "RailVoya-Java-SDK/1.0")
                .GET()
                .build();

        HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new RuntimeException("HTTP Error " + response.statusCode() + ": " + response.body());
        }
        return response.body();
    }

    /**
     * Get Official IRCTC Fast-Track Deep Link
     */
    public String getOfficialIrctcUrl() {
        return "https://www.irctc.co.in/nget/train-search";
    }

    private static String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    /**
     * Standalone main runner demo
     */
    public static void main(String[] args) {
        System.out.println("==========================================");
        System.out.println("  RailVoya Java SDK (Java 11+ HttpClient) ");
        System.out.println("==========================================");

        RailVoyaClient client = new RailVoyaClient();
        String tomorrow = LocalDate.now().plusDays(1).toString();

        try {
            System.out.println("\n[1] Calling Train Search API (NDLS ➔ BPL for " + tomorrow + ")...");
            String searchJson = client.searchTrains("NDLS", "BPL", tomorrow, "GN");
            System.out.println("Response Payload:\n" + truncate(searchJson, 250));

            System.out.println("\n[2] Calling CRIS PNR Status API (PNR #2458910243)...");
            String pnrJson = client.getPnrStatus("2458910243");
            System.out.println("Response Payload:\n" + truncate(pnrJson, 250));

            System.out.println("\n[3] Calling Live RTIS Running Status (Train 20901 Vande Bharat)...");
            String runningJson = client.getRunningStatus("20901");
            System.out.println("Response Payload:\n" + truncate(runningJson, 250));

            System.out.println("\n[4] Official IRCTC Handoff Gateway:");
            System.out.println(client.getOfficialIrctcUrl());

            System.out.println("\n>> Java SDK Execution Completed Successfully!");

        } catch (Exception e) {
            System.err.println("Execution Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static String truncate(String text, int maxLen) {
        if (text == null || text.length() <= maxLen) return text;
        return text.substring(0, maxLen) + "... [truncated]";
    }
}
