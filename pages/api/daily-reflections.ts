import type { NextApiRequest, NextApiResponse } from "next";

import { runMiddleware, cors } from "@/pages/api/cors";
type Data = {
  name: string;
  data: Promise<Response | void>;
};
export interface Response {
  method: string;
  err: number;
  data: string;
  date: string | undefined;
}

export type ResponseError = string | null | undefined;
async function getDate() {
  const today: Date = new Date();
  return `${today.getMonth() + 1}/${today.getDate()}`;
}
function splitOnNewLine(data: string): string[] {
  return data.split(/\r?\n/);
}

function removeUnnecessarySingleQuotes(stringElement: string[]) {
  return stringElement.map((item: string) => {
    // Remove the first and last character if they are double quotes
    if (item.startsWith("'") && item.endsWith("'")) {
      item = item.substring(1, item.length - 1);
    }
    return item.trim();
  });
}

function removeEmptyQuotes(array: string[]): string[] {
  return array.filter((item) => item !== "");
}

async function fetchData(): Promise<Response> {
  try {
    const date: string = await getDate();
    const response = await fetch(`https://www.aa.org/api/reflections/${date}`, {
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error as ResponseError);
    throw error;
  }
}

export function scrubData(response: string[]): string[][] {
  console.log(response, "the resp from fetch");
  return response.map((string) => {
    let processedString: string[];
    processedString = string.replace(/<[^>]*>/g, "").split("\n");
    processedString = removeUnnecessarySingleQuotes(processedString);
    processedString = removeEmptyQuotes(processedString);
    return processedString;
  });
}

async function FetchDailyReflection(): Promise<string[] | void> {
  try {
    const dailyReflections: Response = await fetchData();
    // Now you can use the scrubData function from the previous example
    return scrubData([dailyReflections.data])[0];
  } catch (error) {
    console.error("Error fetching data:", error as ResponseError);
    throw error;
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await runMiddleware(req, res, cors);
  let response: any = await FetchDailyReflection();
  console.log(response, "id");
  res.status(200).json({ name: "DailyReflections", data: response });
}
