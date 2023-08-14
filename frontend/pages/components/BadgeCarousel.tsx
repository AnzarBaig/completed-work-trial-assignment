import React, { useState } from 'react';
import { Badge } from '@mantine/core';
import RecognitionCard from './RecognitionCard';
import { Recognition } from 'typings/general';
import Masonry from 'react-masonry-css';

// Props interface for BadgeCarousel component
interface BadgeCarouselProps {
  recognitionCards: Recognition[];
}

const BadgeCarousel: React.FC<BadgeCarouselProps> = ({ recognitionCards }) => {
  // Extract unique badges from recognitionCards
  const uniqueBadges = [...new Set(recognitionCards.flatMap(card => card.value))];
  // State for currently selected badge
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // Handler for badge click
  const handleBadgeClick = (badge: string) => {
    setSelectedBadge(prevBadge => (prevBadge === badge ? null : badge));
  };

  // Filter recognition cards based on selected badge
  const filteredRecognitionCards = selectedBadge
    ? recognitionCards.filter(card => card.value === selectedBadge)
    : recognitionCards;

  return (
    <div className="flex flex-col space-y-4 items-center">
      {/* Display badges */}
      <div className="flex flex-wrap justify-center space-x-1">
        {uniqueBadges.map(badge => (
          badge && (
            <Badge
              color="teal"
              style={{ cursor: 'pointer' }}
              className={`px-1 py-0.5 m-1 text-xs ${
                selectedBadge === badge ? 'bg-teal-400 text-white' : ''
              }`}
              key={badge}
              onClick={() => handleBadgeClick(badge)}
            >
              {badge}
            </Badge>
          )
        ))}
      </div>
      {/* Display filtered recognition cards with Masonry layout */}
      {filteredRecognitionCards.length > 0 && selectedBadge && (
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
          className={'my-masonry-grid'}
          columnClassName={'my-masonry-grid_column'}
        >
          {filteredRecognitionCards.map(card => (
            <div key={card.id} className={'my-masonry-grid_column'}>
              {/* Render RecognitionCard component */}
              <RecognitionCard recognition={card} />
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default BadgeCarousel;
