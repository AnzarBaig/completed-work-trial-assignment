import React, { useState } from 'react';
import { Input, Avatar, Button } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

interface NavbarProps {
  onSearch: (searchTerm: string) => void;
  onDateSelect: (selectedDate: Date | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onDateSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpened, setCalendarOpened] = useState<boolean>(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  const handleDateSelect = (value: [Date | null, Date | null]) => {
    setSelectedDate(value[0]);
    onDateSelect(value[0]);
    setCalendarOpened(false);
  };

  const toggleCalendar = () => {
    setCalendarOpened(!calendarOpened);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 mb-2 bg-blue-500">
      <div className="flex items-center mb-4 md:mb-0">
        <Avatar
          size="lg"
          src="./Images/bear.webp"
          alt="User Avatar"
          className="mr-4"
        />
        <h3 className="text-white font-bold text-xl">Recognition Wall</h3>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 ml-2 relative">
        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by giver or receiver"
          className="w-full md:w-auto"
        />
        <Button
          onClick={toggleCalendar}
          className="mt-2 md:mt-0 ml-0 md:ml-2 border border-slate-400 rounded px-4 py-2"
        >
          Calendar
        </Button>
        {calendarOpened && (
          <div
            className="absolute mt-2 md:mt-0 top-full left-0 md:right-0 z-50 p-4 bg-white rounded-lg shadow-md md:w-[300px]"
          >
            <DatePicker
              type="range"
              allowSingleDateInRange
              value={[selectedDate, selectedDate]}
              onChange={handleDateSelect}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;
