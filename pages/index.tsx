import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncIterableIterator<R>;
}

export default function Home() {
  const [justForTodayData, setJustForTodayData] = useState<string[]>([]);
  const [dailyReflectionsData, setDailyReflectionsData] = useState<string[]>(
    [],
  );

  console.log(dailyReflectionsData, "the fuc");

  function _removeNonBreakingWhiteSpaces(stringElement: string[]) {
    return stringElement.map((item: string) => {
      let parts = item.match(/&nbsp;/g);
      if (parts !== null && parts.length > 1) {
        return parts;
      }
    });
  }

  function replaceEncodedQuotObjects(stringElement: string) {
    return stringElement.replace(/&quot;/g, '"');
  }

  function _extractDateObjectAndParseInSeparateElement(
    stringElement: string[],
  ) {
    return stringElement
      .map((item) => {
        let parts = item.match(
          /((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})(.*)/,
        );
        if (parts !== null && parts !== undefined && parts.length > 1) {
          return parts[1];
        }
      })
      .filter((item) => item !== undefined) as string[];
  }

  function removeUnnecessaryDoubleQuotes(stringElement: string[]) {
    return stringElement.map((item: string) => {
      // Remove the first and last character if they are double quotes
      if (item.startsWith('"') && item.endsWith('"')) {
        item = item.substring(1, item.length - 1);
      }
      return item.trim();
    });
  }

  function removeEmptyQuotesAsValues(stringElement: string[]) {
    return stringElement.filter((item: string) => item !== "");
  }

  function removeUndefinedValues(extractedDate: string[]) {
    return extractedDate.filter((item) => item !== undefined);
  }

  function getArrayOfStringsFromHtml(htmlArray: string[], arr: any[]) {
    return htmlArray.map((element: string): any[] => {
      let stringElement = element.split("\n");
      stringElement = removeEmptyQuotesAsValues(stringElement);
      stringElement = removeUnnecessaryDoubleQuotes(stringElement);
      let removeNonBreakingWhiteSpaces =
        _removeNonBreakingWhiteSpaces(stringElement);
      let extractedDate =
        _extractDateObjectAndParseInSeparateElement(stringElement);
      extractedDate = removeUndefinedValues(extractedDate);
      stringElement.unshift(extractedDate?.toString());
      stringElement.splice(1, 1);
      stringElement.push(removeNonBreakingWhiteSpaces?.toString());
      stringElement.splice(stringElement.length - 2, 1);
      let objArray = stringElement.map((value, index) => {
        return { key: index, value: value };
      });

      arr.push(objArray);
      return arr;
    });
  }

  const fetchData = async () => {
    const jftRes = await fetch("/api/just-for-today");
    const json = await jftRes.json();
    const arr: any[] = [];
    const htmlArray = json.content;
    const cats = getArrayOfStringsFromHtml(htmlArray, arr);
    setJustForTodayData(cats[0][0]);
    const dailyRefRes = await fetch("/api/daily-reflections");
    const dailyRefResJson = await dailyRefRes.json();
    console.log(dailyRefResJson, "jsonss");
    const dailyRefArr: any[] = [];
    let objArray: string[] = dailyRefResJson.data.map(
      (value: string, index: number) => {
        return { key: index, value: value };
      },
    );
    setDailyReflectionsData(objArray);
  };
  useEffect(() => {
    const init = async () => {
      await fetchData();
    };
    init();
  }, []);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div
        className={`mb-32 grid text-center lg:max-w-3xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30`}
      >
        {justForTodayData.map((value: string, index: number) => {
          return (
            <>
              <p
                key={index}
                className={`m-0 mb-10 text-center text-lg opacity-60`}
              >
                {value.value}
              </p>
            </>
          );
        })}
      </div>
      <div
        className={`mb-32 grid text-center lg:max-w-3xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30`}
      >
        {dailyReflectionsData ? (
          dailyReflectionsData.map((value: string, index: number) => {
            console.log(value, "value");
            return (
              <>
                <p
                  key={index}
                  className={`m-0 mb-10 text-center text-lg opacity-60`}
                >
                  {value.value}
                </p>
              </>
            );
          })
        ) : (
          <>Loading...</>
        )}
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Discover and deploy boilerplate example Next.js&nbsp;projects.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
