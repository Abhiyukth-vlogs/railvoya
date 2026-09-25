import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SavedPassenger } from "../types";
import { api } from "../services/api";
import {
  User,
  Users,
  Plus,
  Trash2,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const [passengers, setPassengers] = useState<SavedPassenger[]>([]);
  const [loading, setLoading] = useState(true);

  // New passenger form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState("Male");
  const [newBerth, setNewBerth] = useState("No Preference");
  const [newFood, setNewFood] = useState("No Food");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPassengers = async () => {
    setLoading(true);
    try {
      const data = await api.getSavedPassengers();
      setPassengers(data);
    } catch {
      setPassengers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPassengers();
  }, [user]);

  const handleAddPassenger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSubmitting(true);
    try {
      await api.addSavedPassenger({
        full_name: newName.trim(),
        age: newAge,
        gender: newGender,
        berth_preference: newBerth,
        food_preference: newFood,
      });
      setNewName("");
      setShowAddForm(false);
      await fetchPassengers();
    } catch (err: any) {
      alert(err.message || "Failed to save passenger.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSavedPassenger(id);
      setPassengers(passengers.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete passenger.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-page-bg">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-action-orange uppercase tracking-wider">Account Settings</span>
          <h1 className="text-3xl font-extrabold text-navy-primary tracking-tight mt-0.5">My Profile & Travelers</h1>
        </div>

        {/* User Card */}
        {user && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-action-orange flex items-center justify-center font-black text-2xl">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-primary">{user.full_name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-navy-primary self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-action-orange" />
              <span>Verified Account</span>
            </div>
          </div>
        )}

        {/* Saved Passengers Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-main shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <h3 className="text-lg font-extrabold text-navy-primary">Saved Travelers Roster</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Save frequent family and friends to pre-fill their details during railway checkout.
              </p>
            </div>

            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-action-orange hover:bg-action-hover text-white font-bold text-xs shadow-sm transition-all min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Traveler</span>
              </button>
            )}
          </div>

          {/* Add Form Drawer */}
          {showAddForm && (
            <form onSubmit={handleAddPassenger} className="p-5 rounded-2xl bg-slate-50 border border-border-main space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="font-bold text-sm text-navy-primary">Add New Traveler</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-semibold text-text-secondary hover:text-navy-primary"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-6">
                  <label className="block font-bold text-text-secondary mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Neha Sharma"
                    className="w-full px-3 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold min-h-[40px]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-text-secondary mb-1">Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={newAge}
                    onChange={(e) => setNewAge(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold min-h-[40px]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-text-secondary mb-1">Gender *</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold min-h-[40px]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block font-bold text-text-secondary mb-1">Berth Preference</label>
                  <select
                    value={newBerth}
                    onChange={(e) => setNewBerth(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold min-h-[40px]"
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Lower Berth">Lower Berth</option>
                    <option value="Middle Berth">Middle Berth</option>
                    <option value="Upper Berth">Upper Berth</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                    <option value="Window">Window Seat</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block font-bold text-text-secondary mb-1">Food Preference</label>
                  <select
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-border-main rounded-xl text-sm font-semibold min-h-[40px]"
                  >
                    <option value="No Food">No Food</option>
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-border-main text-xs font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-action-orange text-white text-xs font-bold"
                >
                  {isSubmitting ? "Saving..." : "Save Traveler"}
                </button>
              </div>
            </form>
          )}

          {/* Passenger List */}
          {loading ? (
            <div className="py-8 text-center text-xs text-text-secondary">Loading saved travelers...</div>
          ) : passengers.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-secondary">
              No saved travelers found. Add your family or frequent co-passengers above.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle border border-border-subtle rounded-2xl overflow-hidden">
              {passengers.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50/50 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-bold text-navy-primary">{p.full_name}</span>
                    <p className="text-xs text-text-secondary">
                      {p.age} Yrs • {p.gender} • Berth: {p.berth_preference} • Food: {p.food_preference}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-slate-400 hover:text-status-error min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                    aria-label={`Delete ${p.full_name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
