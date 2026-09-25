import {
  Station,
  TrainSearchResult,
  TrainSchedule,
  AvailabilityResponse,
  Booking,
  User,
  SavedPassenger,
  PnrStatus,
  RunningStatus,
} from "../types";

const API_BASE = "/api/v1";

export class ApiError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string = "API_ERROR", details?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // For HttpOnly session cookie transmission
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      let errData: any = {};
      try {
        errData = await res.json();
      } catch {
        // Not JSON
      }
      const errObj = errData.error || errData.detail?.error || errData.detail || {};
      const msg = errObj.message || errData.message || (typeof errData.detail === 'string' ? errData.detail : "An error occurred with the request.");
      const code = errObj.code || (typeof errData.detail?.error === 'string' ? errData.detail.error : "ERROR");
      throw new ApiError(msg, code, errObj.details);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Network connection failure. Please check your connection.");
  }
}

export const api = {
  // System
  getCapabilities: () => request<any>("/system/capabilities"),
  getHealth: () => request<any>("/system/health"),

  // Stations
  searchStations: (q: string) => request<Station[]>(`/stations/search?q=${encodeURIComponent(q)}`),
  getPopularStations: () => request<Station[]>("/stations/popular"),

  // Trains
  searchTrains: (origin: string, destination: string, date: string, travelClass?: string, quota: string = "GN") => {
    let url = `/trains/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&journey_date=${encodeURIComponent(date)}&quota=${encodeURIComponent(quota)}`;
    if (travelClass && travelClass !== "ALL") {
      url += `&travel_class=${encodeURIComponent(travelClass)}`;
    }
    return request<TrainSearchResult[]>(url);
  },
  getTrainSchedule: (trainNumber: string) => request<TrainSchedule>(`/trains/${encodeURIComponent(trainNumber)}/schedule`),

  // Availability & Fares
  checkAvailability: (payload: {
    train_number: string;
    origin: string;
    destination: string;
    journey_date: string;
    travel_class: string;
    quota: string;
    passenger_count: number;
  }) => request<AvailabilityResponse>("/availability/check", {
    method: "POST",
    body: JSON.stringify(payload),
  }),

  // Bookings
  createBooking: (payload: any) => request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  getMyBookings: () => request<Booking[]>("/bookings"),
  getBooking: (id: string) => request<Booking>(`/bookings/${encodeURIComponent(id)}`),
  cancelBooking: (id: string, reason?: string) => request<{ booking_id: string; pnr_number: string; status: string; refund_amount: number; cancellation_charge: number; message: string }>(`/bookings/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  }),
  getTicketPdfUrl: (id: string) => `${API_BASE}/bookings/${encodeURIComponent(id)}/ticket.pdf`,

  // PNR & Live Running
  getPnrStatus: (pnr: string) => request<PnrStatus>(`/pnr/${encodeURIComponent(pnr)}`),
  getRunningStatus: (trainNumber: string, date?: string) => {
    const url = `/running-status/${encodeURIComponent(trainNumber)}${date ? `?journey_date=${encodeURIComponent(date)}` : ""}`;
    return request<RunningStatus>(url);
  },

  // Contact
  submitContact: (payload: { full_name: string; email: string; phone?: string; subject: string; message: string }) => request<any>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  }),

  // Auth
  signup: (payload: any) => request<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  login: (payload: any) => request<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  logout: () => request<{ message: string }>("/auth/logout", {
    method: "POST",
  }),
  getProfile: () => request<User>("/auth/me"),
  getSavedPassengers: () => request<SavedPassenger[]>("/auth/passengers"),
  addSavedPassenger: (payload: any) => request<SavedPassenger>("/auth/passengers", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  deleteSavedPassenger: (id: string) => request<{ message: string }>(`/auth/passengers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  }),
};
