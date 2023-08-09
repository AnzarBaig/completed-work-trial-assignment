
import React from "react";
import { Card, Image, Text, Badge } from "@mantine/core";
import { Recognition } from "typings/general";
import Shimmer from "./Shimmer"; // Import the Shimmer component

interface RecognitionCardProps {
  recognition: Recognition;
  isLoading?: boolean; // Add isLoading prop
}

const RecognitionCard: React.FC<RecognitionCardProps> = ({ recognition, isLoading }) => {
  const {
    id,
    giver_alias: giverName,
    receiver_names: receiverNames,
    team_name: teamName,
    message,
    date_posted: date,
    value: companyValue,
    img,
  } = recognition;

  return (
    <Card shadow="xs" padding="md" radius="lg" className="bg-white">
      {isLoading ? (
        <Shimmer /> // Display shimmer effect only during initial loading
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-center">
            <Image
              src={img ? img : "./Images/placeholder.jpg"}
              alt="Profile Image"
              width={100}
              height={75}
              radius="md"
            />
          </div>
          <Text size="sm" weight={700} className="mb-1">
            Recognition from {giverName} to {receiverNames.join(", ")}
          </Text>
          <Text size="xs" color="gray" className="mb-1">
            Team: {teamName}
          </Text>
          <Text size="xs" color="gray" className="mb-2">
            Posted: {date ? new Date(date).toLocaleString() : "N/A"}
          </Text>
          <Text size="xs" className="mb-2">
            {message}
          </Text>
          <div className="justify mt-auto flex flex-col space-x-1 ">
            {companyValue && (
              <Badge color="teal" className="px-1 py-0.5 text-xs">
                {companyValue}
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default RecognitionCard;
