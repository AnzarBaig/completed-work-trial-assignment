import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import RecognitionCard from './components/RecognitionCard';
import { Recognition } from 'typings/general';
import Navbar from './components/Navbar';
import BadgeCarousel from './components/BadgeCarousel';
import { Loader } from '@mantine/core';

const PAGE_SIZE = 20;

const fetchRecognitions = async ({ pageParam = 1 }) => {
  const response = await axios.get<{
    data: { recognitions: Recognition[]; totalCount: number };
  }>(`http://localhost:8000/api/recognitionwall/?page=${pageParam}&size=${PAGE_SIZE}`);
  return response.data.data;
};

const RecognitionWall: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true); // Add state for initial loading

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm.toLowerCase());
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['recognitions'],
    fetchRecognitions,
    {
      getNextPageParam: (lastPage, pages) => {
        const currentPage = pages.length;
        const totalPageCount = Math.ceil(lastPage.totalCount / PAGE_SIZE);

        if (currentPage < totalPageCount) {
          return currentPage + 1;
        }

        return undefined;
      },
      staleTime: 5000,
      cacheTime: 5000
    }
  );

  useEffect(() => {
    // Once the initial data is fetched, set isInitialLoading to false
    if (data && data.pages.length > 0) {
      setIsInitialLoading(false);
    }
  }, [data]);

  const totalFetched = data?.pages.reduce((acc, page) => acc + page.recognitions.length, 0);

  const filteredRecognitions = data?.pages.flatMap((page) =>
    page.recognitions.filter((recognition) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchGiverAlias = recognition.giver_alias.toLowerCase().includes(lowerCaseSearchTerm);
      const matchReceiverNames = recognition.receiver_names.some((name) =>
        name.toLowerCase().includes(lowerCaseSearchTerm)
      );

      return matchGiverAlias || matchReceiverNames;
    })
  ) || [];

  const dateFilteredRecognitions = filteredRecognitions.filter((recognition) => {
    const recognitionDate = recognition.date_posted ? new Date(recognition.date_posted) : null;

    const isDateMatch = selectedDate
      ? recognitionDate && recognitionDate.toDateString() === selectedDate.toDateString()
      : true;

    return isDateMatch;
  });

  return (
    <>
      <Navbar onSearch={handleSearch} onDateSelect={handleDateChange} />
      <BadgeCarousel recognitionCards={dateFilteredRecognitions} />

      {dateFilteredRecognitions.length > 0 && (
        <InfiniteScroll
          dataLength={totalFetched || 0}
          next={fetchNextPage}
          hasMore={hasNextPage ? hasNextPage : false}
          loader={
            isFetching ? (
              <div className="text-center py-4">
                <Loader size="lg" variant="dots" className="mx-auto" />
              </div>
            ) : null
          }
          endMessage={
            <div className="text-center py-4 mx-auto">
              <hr className="border-t border-gray-300 mb-2" />
              <p className="text-gray-500">That's all, folk!</p>
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <Masonry
            breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
            className={'my-masonry-grid'}
            columnClassName={'my-masonry-grid_column'}
          >
            {dateFilteredRecognitions.map((recognition) => (
              <div key={recognition.id} className={'my-masonry-grid_column'}>
                {/* Pass isInitialLoading to show shimmer effect only during initial loading */}
                <RecognitionCard recognition={recognition} isLoading={isInitialLoading} />
              </div>
            ))}
          </Masonry>
        </InfiniteScroll>
      )}
    </>
  );
};

export default RecognitionWall;
