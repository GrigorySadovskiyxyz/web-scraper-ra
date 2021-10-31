
import { getUpcomingEventsUrls } from "./services/calendar_events_service";
import { scrapeEvent } from "./services/page_scraper_service";
import express from 'express';

const app = express();
const port = 3000;
app.get('/', async (req, res) => {
    // let eventsResult: Array<string>;
    let eventUrls: Array<string> = await getUpcomingEventsUrls();
    let eventsResult = await eventUrls // todo i dont know why await has no effect here
        .map(async eventUrlString => {
            let eventScraped = await scrapeEvent(eventUrlString);
            console.log(eventScraped?.toJson());
            return eventScraped?.toJson();
        })
        .filter(notEmpty);
    
    res.send(eventsResult);
});

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}