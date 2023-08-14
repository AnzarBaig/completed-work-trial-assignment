import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const emoji = require("node-emoji");
const prisma = new PrismaClient();

type RequestParams = void;
type RequestBody = void;
type RequestQuery = {
  query?: string;
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
  error?: string;
};

export const search = async (
  req: Request<RequestParams, ResponseData, RequestBody, RequestQuery>,
  res: Response<ResponseData>
) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(200).json({
        recognitions: [],
        totalCount: 0,
      });
    }

    const allRecognitions = await prisma.recognitions.findMany();

    const lowerQuery = query.toLowerCase(); // Convert query to lowercase

    const searchData = allRecognitions.filter((item) => {
      return (
        item.giver_alias.toLowerCase().includes(lowerQuery) ||
        item.message.toLowerCase().includes(lowerQuery) ||
        item.receiver_names.some((name) => name.toLowerCase().includes(lowerQuery))
      );
    });

    const recognitions: RecognitionData[] = searchData.map((item) => ({
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
      recognitions,
      totalCount: recognitions.length,
    });
  } catch (err) {
    console.error("Error in search:", err);
    res.status(500).json({
      recognitions: [],
      totalCount: 0,
      error: "Internal Server Error",
    });
  }
};
