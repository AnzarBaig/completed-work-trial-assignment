import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import RecognitionCard from './RecognitionCard';
import { Recognition } from 'typings/general';
import Navbar from './Navbar';
import BadgeCarousel from './BadgeCarousel';
import { Loader } from '@mantine/core';

const PAGE_SIZE = 20;

const fetchRecognitions = async ({ pageParam = 1 }) => {
  const response = await axios.get<{
    data: { recognitions: Recognition[]; totalCount: number };
  }>(`http://localhost:8000/api/recognitionwall/?page=${pageParam}&size=${PAGE_SIZE}`);
  return response.data.data;
};

const RecognitionWall: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setSelectedDates(dates);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm.toLowerCase());
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
      cacheTime: 5000,
    }
  );

  useEffect(() => {
    if (data && data.pages.length > 0) {
      setIsInitialLoading(false);
    }
  }, [data]);

  const totalFetched = data?.pages.reduce((acc, page) => acc + page.recognitions.length, 0);

  const filteredRecognitions = data?.pages.flatMap((page) =>
    page.recognitions.filter((recognition) => {
      const recognitionDate = recognition.date_posted ? new Date(recognition.date_posted) : null;
      const isDateMatch =
        selectedDates[0] && selectedDates[1]
          ? recognitionDate &&
            recognitionDate >= selectedDates[0] && recognitionDate <= selectedDates[1]
          : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchGiverAlias = recognition.giver_alias.toLowerCase().includes(lowerCaseSearchTerm);
      const matchReceiverNames = recognition.receiver_names.some((name) =>
        name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      const matchMessage = recognition.message.toLowerCase().includes(lowerCaseSearchTerm);

      return (!selectedDates[0] || !selectedDates[1] || isDateMatch) &&
             (matchGiverAlias || matchReceiverNames || matchMessage);
    })
  ) || [];
  return (
    <>
      <Navbar onDateSelect={handleDateChange} onSearch={handleSearch} />
      <BadgeCarousel recognitionCards={filteredRecognitions} />

      {filteredRecognitions.length > 0 ? (
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
            breakpointCols={{ default: 5, 1600: 4, 1100: 3, 700: 2, 500: 1 }}
            className={'my-masonry-grid'}
            columnClassName={'my-masonry-grid_column'}
          >
            {filteredRecognitions.map((recognition) => (
              <div key={recognition.id} className={'my-masonry-grid_column'}>
                <RecognitionCard recognition={recognition} isLoading={isInitialLoading} />
              </div>
            ))}
          </Masonry>
        </InfiniteScroll>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">What On Earth Are You Talking About!🤔 bruh?.</p>
        </div>
      )}
    </>
  );
};

export default RecognitionWall;
