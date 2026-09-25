export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  hindi_name?: string;
  is_major_junction?: boolean;
}

export interface ClassAvailability {
  class_code: string;
  class_name: string;
  fare: number;
  status: "AVAILABLE" | "RAC" | "WL" | "REGRET" | string;
  status_detail: string;
  seats_count: number;
  last_updated: string;
  catering_available?: boolean;
  confirmation_probability?: number;
}

export interface TrainSearchResult {
  train_number: string;
  train_name: string;
  train_type: string;
  origin_code: string;
  origin_name: string;
  destination_code: string;
  destination_name: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  arrival_day_offset: number;
  running_days: string[];
  classes: ClassAvailability[];
  on_time_rating?: string;
  pantry_available?: boolean;
}

export interface ScheduleStop {
  station_code: string;
  station_name: string;
  arrival_time: string;
  departure_time: string;
  halt_minutes: number;
  day_count: number;
  distance_km: number;
  platform: string;
}

export interface TrainSchedule {
  train_number: string;
  train_name: string;
  train_type: string;
  running_days: string[];
  total_distance_km: number;
  total_duration: string;
  stops: ScheduleStop[];
}

export interface FareBreakdown {
  base_fare: number;
  reservation_charge: number;
  superfast_charge: number;
  tatkal_charge: number;
  gst_amount: number;
  total_fare_per_passenger: number;
  total_amount: number;
  currency: string;
}

export interface AvailabilityResponse {
  train_number: string;
  train_name: string;
  origin_code: string;
  destination_code: string;
  journey_date: string;
  travel_class: string;
  quota: string;
  status: string;
  status_detail: string;
  seats_available: number;
  fare_breakdown: FareBreakdown;
  last_updated: string;
  disclaimer: string;
}

export interface PassengerInput {
  full_name: string;
  age: number;
  gender: "Male" | "Female" | "Transgender";
  berth_preference: string;
  food_preference?: string;
  senior_citizen?: boolean;
  save_to_account?: boolean;
}

export interface IRCTCOptions {
  irctc_user_id?: string;
  auto_upgradation?: boolean;
  booking_condition?: string;
  travel_insurance?: boolean;
  boarding_station_code?: string;
  gstin?: string;
  company_name?: string;
  company_address?: string;
}

export interface BookingPassenger {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  berth_preference: string;
  assigned_coach: string;
  assigned_berth: number;
  assigned_berth_type: string;
  current_status: string;
  status_detail: string;
}

export interface Booking {
  id: string;
  pnr_number: string;
  train_number: string;
  train_name: string;
  origin_code: string;
  origin_name: string;
  destination_code: string;
  destination_name: string;
  boarding_station_code: string;
  journey_date: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  arrival_day_offset: number;
  travel_class: string;
  quota: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING_PAYMENT" | "FAILED" | "PENDING_RECONCILIATION" | string;
  passengers: BookingPassenger[];
  base_fare: number;
  reservation_charge: number;
  superfast_charge: number;
  tatkal_charge: number;
  gst_amount: number;
  total_amount: number;
  refund_amount: number;
  contact_email: string;
  contact_phone: string;
  is_demo: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

export interface SavedPassenger {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  berth_preference: string;
  food_preference: string;
  senior_citizen: boolean;
  created_at: string;
}

export interface PnrPassenger {
  passenger_number: number;
  booking_status: string;
  current_status: string;
  coach: string;
  berth_number: number;
  berth_type: string;
}

export interface PnrStatus {
  pnr_number: string;
  train_number: string;
  train_name: string;
  journey_date: string;
  origin_code: string;
  origin_name: string;
  destination_code: string;
  destination_name: string;
  boarding_point: string;
  travel_class: string;
  quota: string;
  chart_status: string;
  passengers: PnrPassenger[];
  last_updated: string;
  is_demo: boolean;
}

export interface RunningStop {
  station_code: string;
  station_name: string;
  scheduled_arrival: string;
  scheduled_departure: string;
  actual_arrival: string;
  actual_departure: string;
  delay_arrival_minutes: number;
  delay_departure_minutes: number;
  platform: string;
  has_arrived: boolean;
  has_departed: boolean;
  is_current: boolean;
}

export interface RunningStatus {
  train_number: string;
  train_name: string;
  journey_date: string;
  current_station: string;
  current_status_summary: string;
  delay_minutes: number;
  last_updated: string;
  stops: RunningStop[];
  is_demo: boolean;
}

export interface SearchState {
  originStation: Station | null;
  destinationStation: Station | null;
  journeyDate: string;
  travelClass: string;
  quota: string;
}
