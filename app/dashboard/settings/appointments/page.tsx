"use client";

import { useState } from "react";
import { useEstablishment } from "@/app/context/EstablishmentContext";
import BookingToggle from "./components/BookingToggle";
import BookingActive from "./components/BookingAcitve";
import { useAuth } from "@/app/hooks/useAuth";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { activeEstablishment } = useEstablishment();
  const [bookingEnabled, setBookingEnabled] = useState(
    activeEstablishment?.bookingEnabled || false,
  );

  const handleToggle = async () => {
    const newValue = !bookingEnabled;
    setBookingEnabled(newValue);
    console.log("Nuevo estado bookingEnabled:", newValue);
    // acá va tu llamada al backend
  };

  return (
    <div className="p-6">
      {activeEstablishment?.bookingEnabled ? (
        <BookingActive establishmentName={activeEstablishment?.name} />
      ) : (
        <BookingToggle
          bookingEnabled={bookingEnabled}
          establishmentName={activeEstablishment?.name}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}
