import { Browser, PuppeteerNode } from "puppeteer";

const puppeteer: PuppeteerNode = require('puppeteer');
const moment = require('moment');

export async function getUpcomingEventsUrls(): Promise<Array<string>> {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-setuid-sandbox"],
    'ignoreHTTPSErrors': true
  });

  let upcomingEventsWhole: Array<string> = [];

  let step = 0;
  let toContinueLoop: boolean = true
  while (toContinueLoop) {
    const pageDate = moment().add(step, 'days').format().slice(0, 10);
    const firstUrl = `https://ra.co/events/ru/moscow?week=${pageDate}`;
    let upcomingEventsPart = await extractEventsUrlsFromPage(browser, firstUrl);
    if (upcomingEventsPart.length > 0) {
      upcomingEventsWhole.concat(upcomingEventsPart);
      step += 7;
    } else {
      toContinueLoop = false;
    }
  }
  // Todo: Update database with events
  await browser.close();
  return upcomingEventsWhole;
};

async function extractEventsUrlsFromPage(browser: Browser, pageUrl: string): Promise<Array<string>> {
  // Scrape the data we want
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
  let arrayLinks: Array<string> = [];
  await page.evaluate(() => {
    let htmlElements = Array.from(document.querySelectorAll("h3[class~='Box-omzyfs-0'] > a"));
    let links = htmlElements.map(item => item.getAttribute('href'));
    return links
      .filter(notEmpty)
      .filter(onlyUnique)
  });

  console.log(arrayLinks)
  await page.close();
  return arrayLinks;
};

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

function onlyUnique(value: string, index: number, self: Array<string>) {
  return self.indexOf(value) === index;
}
