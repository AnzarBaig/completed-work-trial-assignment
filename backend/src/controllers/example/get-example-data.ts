import { Controller } from "typings/express";
import { PrismaClient } from '@prisma/client';
const emoji = require("node-emoji");
const prisma = new PrismaClient();

type RequestParams = void;
type RequestBody = void;
type RequestQuery = {
  page?: number;
  size?: number;
};

type RecognitionData = {
  id: number;
  team_id: string;
  team_name: string;
  message: string;
  value: string | null;
  img: string | null;
  date_posted: Date | null;
  giver_alias: string;
  receiver_names: string[];
};

type ResponseData = {
  recognitions: RecognitionData[];
  totalCount: number;
};

export const getRecognitionData: Controller<RequestParams, ResponseData, RequestBody, RequestQuery> = async (
  req,
  res
) => {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 20;

    const skip = (page - 1) * size;

    const data = await prisma.recognitions.findMany({
      where: {
        team_id: {
          equals: 'T01HP7H5HME',
        },
      },
      skip,
      take: size,
    });

    const totalCount = await prisma.recognitions.count({
      where: {
        team_id: {
          equals: 'T01HP7H5HME',
        },
      },
    });

    // Mapping the response data to the RecognitionData structure 
    const recognitions: RecognitionData[] = data.map((item) => ({
      id: item.id,
      team_id: item.team_id,
      team_name: item.team_name,
      message: item.message,
      value: item.value ? emoji.emojify(item.value) : null,
      img: item.img,
      date_posted: item.date_posted,
      giver_alias: item.giver_alias,
      receiver_names: item.receiver_names,
    }));

    res.status(200).json({
      success: true,
      code: 200,
      data: {
        recognitions: recognitions,
        totalCount: totalCount,
      },
    });
  } catch (err) {
    console.log("ERROR IN GET POSTS");
    console.log({ err });
    res.status(500).json({
      success: false,
      code: 500,
      error: "Internal Server Error",
    });
  }
  
};