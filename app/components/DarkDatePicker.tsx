"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
};

export default function DarkDatePicker({
  selectedDate,
  setSelectedDate,
}: Props) {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date | null) => setSelectedDate(date)}
      dateFormat="yyyy-MM-dd"
      className="bg-gray-800 text-white text-lg px-2 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 w-36"
      calendarClassName="custom-calendar"
    />
  );
}
