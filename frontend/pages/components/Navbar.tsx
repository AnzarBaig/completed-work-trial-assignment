import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Loader, Avatar } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { Recognition } from "typings/general";

// Props interface for Navbar component
interface NavbarProps {
	onSearch: (searchTerm: string) => void;
	onDateSelect: (selectedDates: [Date | null, Date | null]) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onDateSelect }) => {
	// State variables for search and date filtering
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
	const [calendarOpened, setCalendarOpened] = useState<boolean>(false);
	const [searchResults, setSearchResults] = useState<Recognition[]>([]);
	const [loadingResults, setLoadingResults] = useState<boolean>(false);

	// Event handler for date selection
	const handleDateSelect = (value: [Date | null, Date | null]) => {
		setSelectedDates(value);
	};

	// Apply date filter and close calendar
	const applyDateFilter = () => {
		onDateSelect(selectedDates);
		setCalendarOpened(false);
	};

	// Toggle the calendar's visibility
	const toggleCalendar = () => {
		setCalendarOpened(!calendarOpened);
	};

	// Handle search input change
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = event.target.value;
		setSearchTerm(newSearchTerm);
		onSearch(newSearchTerm);
	};

	// Fetch search results using axios and update state
	useEffect(() => {
		if (searchTerm) {
			setLoadingResults(true);
			axios
				.get<{ data: { recognitions: Recognition[] } }>(`http://localhost:8000/api/search?query=${searchTerm}`)
				.then((response) => {
					setSearchResults(response.data.data.recognitions);
					console.log(response);
				})
				.catch((error) => {
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
		<div className="mb-2 flex flex-col items-center justify-between bg-blue-500 p-4 md:flex-row">
			<div className="flex items-center">
				<Avatar size="lg" src="./Images/bear.webp" alt="User Avatar" className="mr-4" />
				<h3 className="text-xl font-bold text-white">Recognition Wall</h3>
			</div>
			<div className="relative ml-0 mt-4 flex items-center space-x-2 md:ml-2 md:mt-0">
				<div className="relative w-full">
					<Input value={searchTerm} onChange={handleSearchChange} placeholder="Search by giver or receiver" />
					{loadingResults && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
							<Loader size="xs" />
						</div>
					)}
				</div>
				<Button onClick={toggleCalendar} className="rounded border border-slate-400 px-4 py-2">
					Calendar
				</Button>
				<Modal
					opened={calendarOpened}
					onClose={() => setCalendarOpened(false)}
					title="Select Date Range"
					size="xs"
				>
					<div className="p-4">
						<DatePicker type="range" value={selectedDates} onChange={handleDateSelect} />
						<div className="mt-4 flex justify-center">
							<Button onClick={applyDateFilter} className="rounded border border-slate-400 px-4 py-2">
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
