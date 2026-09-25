import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";

// Pages
import { HomePage } from "./pages/HomePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { BookingPage } from "./pages/BookingPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { MyTripsPage } from "./pages/MyTripsPage";
import { PnrStatusPage } from "./pages/PnrStatusPage";
import { TrainStatusPage } from "./pages/TrainStatusPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AccountPage } from "./pages/AccountPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HelpPage } from "./pages/HelpPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { BusinessMonetizationPage } from "./pages/BusinessMonetizationPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <div className="flex flex-col min-h-screen bg-page-bg text-text-main selection:bg-orange-100 selection:text-action-orange">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/booking/confirmation/:bookingId" element={<ConfirmationPage />} />
                <Route path="/trips" element={<MyTripsPage />} />
                <Route path="/pnr" element={<PnrStatusPage />} />
                <Route path="/train-status" element={<TrainStatusPage />} />
                <Route path="/running-status" element={<TrainStatusPage />} />
                <Route path="/business-model" element={<BusinessMonetizationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>

            </main>
            <Footer />
          </div>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
