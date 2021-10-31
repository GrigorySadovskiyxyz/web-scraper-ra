import { EventFullScrapedDto } from "../data/event";
const puppeteer = require('puppeteer');

export async function scrapeEvent(url: string): Promise<EventFullScrapedDto | null> {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
    });
    const page = await browser.newPage();

    await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
    console.log(`goint to scrape event at ${url}`);
    let name: string;
    let placeName: string;
    let startDateTimeString;
    let startDateTime: Date;
    let endDateTime: Date;
    let ticketPrices: Array<number>;
    let organizers: Array<number>;
    let imageLink: string;
    let about: string;
    let ticketsLink: string;
    return await page.evaluate(async () => { // todo does it give access to document and allows read from html?
        try {
            name = document.querySelector("h1[class~='Box-omzyfs-0'] > span")?.innerHTML || ''; //todo throw exception if null
            placeName = document.querySelectorAll("div[class~='Layout-sc-1j5bbdx-0'] > ul")[0].getElementsByClassName('Text-sc-1t0gn2o-0 ')[1].innerHTML || ''; //todo throw exception if null
            startDateTimeString = document.querySelectorAll("div[class~='Layout-sc-1j5bbdx-0'] > ul")[0].getElementsByTagName('span')[4].innerText;
            startDateTime = new Date(); //todo
            endDateTime = new Date(); //todo
            ticketPrices = [1]; // todo
            organizers = [1]; // todo
            imageLink = 'imageLink'; // todo
            about = 'about'; // todo
            ticketsLink = 'link'; // todo
        } catch (e) {
            console.log(`error while scraping event at ${url} :
                ${e} // todo check formatting
                `);
            return null;
        } finally {
            await browser.close()
        }
        let event = new EventFullScrapedDto({ name: name, startDateTime: startDateTime, endDateTime: endDateTime, placeId: 1, about: about, imageLink: imageLink, organizers: organizers, ticketPrices: ticketPrices, ticketsLink: ticketsLink });
        return event;
    })
}

