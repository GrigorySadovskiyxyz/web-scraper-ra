#!/usr/bin/node
const puppeteer = require('puppeteer');
const fs = require('fs');
const moment = require('moment');


let scrapeAllPages = async () => {

    // Extract partners on the page, recursively check the next page in the URL pattern
    const extractEventsFromPage = async url => {
      // Scrape the data we want
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const eventsLinksOnPage = await page.evaluate(() => {
      let arrayLinks = Array.from(document.querySelectorAll("h3[class~='Box-omzyfs-0'] > a")).map(item => ({
        link: item.href
      }));
      let arrayLinksSet = new Set(arrayLinks.map((item) => item.link));
      console.log(arrayLinksSet)
      return [...arrayLinksSet];
    });
      await page.close();
  
      // Recursively scrape the next page for events
      if (eventsLinksOnPage.length < 1) {
        // Terminate if no partners exist
        return eventsLinksOnPage
      } else {
        // Go fetch the next page ?page=moment() + one week span
        const nextPageDate = moment().add(step, 'days').format().slice(0, 10);
        step += 7;
        const nextUrl = `https://ra.co/events/ru/moscow?week=${nextPageDate}`;
        return eventsLinksOnPage.concat(await extractEventsFromPage(nextUrl))
      }
    };
  
    const browser = await puppeteer.launch({ headless: false,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
    });
    const firstUrl = `https://ra.co/events/ru/moscow?week=${moment().add(0, 'days').format().slice(0, 10)}`;
    let step = 0;
    const events = await extractEventsFromPage(firstUrl);
    // console.log(events);
  
    // Todo: Update database with events
    await browser.close();
    return events;
  };
  
module.exports = { all: scrapeAllPages };