interface EventFullScraped {
    name: string;
    placeId: number;
    startDateTime: Date;
    endDateTime: Date;
    imageLink: string | null;
    about: string | null;
    ticketsLink: string | null;
    ticketPrices: Array<number>;
    organizers: Array<number> | null;
}

export class EventFullScrapedDto {

    constructor(private props: EventFullScraped) {
    }

    toJson(): string {
        return JSON.stringify(this.props)
    }
}

module.exports = EventFullScrapedDto