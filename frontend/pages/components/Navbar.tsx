import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Loader, Avatar } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import axios from 'axios';
import { Recognition } from 'typings/general';

interface NavbarProps {
  onSearch: (searchTerm: string) => void;
  onDateSelect: (selectedDates: [Date | null, Date | null]) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onDateSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const [calendarOpened, setCalendarOpened] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Recognition[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);

  const handleDateSelect = (value: [Date | null, Date | null]) => {
    setSelectedDates(value);
  };

  const applyDateFilter = () => {
    onDateSelect(selectedDates);
    setCalendarOpened(false);
  };

  const toggleCalendar = () => {
    setCalendarOpened(!calendarOpened);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  useEffect(() => {
    if (searchTerm) {
      setLoadingResults(true);
      axios.get<{ data: { recognitions: Recognition[] } }>(`http://localhost:8000/api/search?query=${searchTerm}`)
        .then(response => {
          setSearchResults(response.data.data.recognitions);
          console.log(response);
          
        })
        .catch(error => {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        })
        .finally(() => {
          setLoadingResults(false);
        });
    } else {
      setSearchResults([]);     
    }
  }, [searchTerm]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 mb-2 bg-blue-500">
      <div className="flex items-center">
        <Avatar
          size="lg"
          src="./Images/bear.webp"
          alt="User Avatar"
          className="mr-4"
        />
        <h3 className="text-white font-bold text-xl">Recognition Wall</h3>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-0 ml-0 md:ml-2 relative">
        <div className="relative w-full">
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by giver or receiver"
          />
          {loadingResults && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader size="xs" />
            </div>
          )}
        </div>
        <Button
          onClick={toggleCalendar}
          className="border border-slate-400 rounded px-4 py-2"
        >
          Calendar
        </Button>
        <Modal
          opened={calendarOpened}
          onClose={() => setCalendarOpened(false)}
          title="Select Date Range"
          size="xs"
        >
          <div className="p-4">
            <DatePicker
              type="range"
              value={selectedDates}
              onChange={handleDateSelect}
            />
            <div className="flex justify-center mt-4">
              <Button
                onClick={applyDateFilter}
                className="border border-slate-400 rounded px-4 py-2"
              >
                Apply
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
