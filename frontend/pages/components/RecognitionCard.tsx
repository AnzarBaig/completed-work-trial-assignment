import React from "react";
import { Card, Image, Text, Badge } from "@mantine/core";
import { Recognition } from "typings/general";
import Shimmer from "./Shimmer";

interface RecognitionCardProps {
  recognition: Recognition;
  isLoading?: boolean;
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

  const formattedDate = date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <Card shadow="xs" padding="md" radius="lg" className="bg-white">
      {isLoading ? (
        <Shimmer />
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
          <Text size="md" weight={700} className="mb-1">
            Recognition from {giverName}
            <hr />
            To: {receiverNames.join(", ")}
            <hr />
          </Text>
          <Text size="xs" color="gray" className="mb-2">
            Posted: {formattedDate}
          </Text>
          <Text size="sm" className="mb-2">
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
