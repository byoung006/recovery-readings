import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import {runMiddleware} from "@/pages/api/cors";
type Data = {
    name: string
    data: Promise<Response | void>;
}
export interface Response {
    method: string;
    err: number;
    data: string;
    date:string | undefined;
}

export type ResponseError = string | null | undefined;
async function getDate() {
    const today: Date = new Date();
    return `${today.getMonth() + 1}/${today.getDate()}`;
}

async function fetchData(): Promise<Response> {
    try {
        const date: string = await getDate();
        const response = await fetch(`/aa/api/${date}`, {
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

export function scrubData(response: Response): Response {
    // Check if the response has a "data" key
    if (response.hasOwnProperty("data")) {
        // Remove newline characters
        response.data = response.data.replace(/(\r\n|\n|\r)/gm, "");

        // Remove HTML tags
        response.data = response.data.replace(/<[^>]*>/g, "");

        // Trim any leading or trailing spaces
        response.data = response.data.trim();
    }

    return response;
}

async function FetchDailyReflection(): Promise<Response | void> {
    try {
        const dailyReflections: Response = await fetchData();
        // Now you can use the scrubData function from the previous example
        return scrubData(dailyReflections);
    } catch (error) {
        console.error("Error fetching data:", error as ResponseError);
        throw error;
    }
}
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({ name: 'DailyReflections', data: FetchDailyReflection()
})}
