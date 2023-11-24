// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {runMiddleware, cors} from "@/pages/api/cors";
import fetch from 'node-fetch';
import {scrubData} from "@/pages/api/daily-reflections";

const cheerio = require('cheerio')

type Data = {
    name: string,
    content: string[]
}

function scrubberFunction(data: string): string[] {
    console.log(data, 'data is scrubber')
    if (data) {
        // Remove newline characters
        data = data.replace(/<br\s*\/?>/gi, "\n");

// Remove all other HTML tags
        data = data.replace(/<[^>]*>/g, "");

        // Trim any leading or trailing spaces
        data = data.trim();
    }

    return [data];
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await runMiddleware(req, res, cors)
    const response = await fetch('https://www.jftna.org/jft/')
    const html = await response.text();
// this is kinda broken still. Look for a way to pull in dynamic classes or something in cheerio
    const $ = cheerio.load(html);
    const content = $( 'tr > *').map((i, el) => {
        return $(el)
    }).get().join('');
   const scrubHtml = (html: string):string[] => {
       return scrubberFunction(html)
   }
   // console.log(scrubHtml(content), 'scrubed?')
    const cats = scrubHtml(content)
console.log(cats, 'cats')
    res.status(200).json({name: 'John Doe', content:cats })
}