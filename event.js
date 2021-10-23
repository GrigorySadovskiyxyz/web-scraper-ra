#!/usr/bin/node

const puppeteer = require('puppeteer');
const scrape = require('./script');
const moment = require('moment');
const fs = require('fs');

(async () => { 
        const browser = await puppeteer.launch({ headless: false,
        args: ["--disable-setuid-sandbox"],
    'ignoreHTTPSErrors': true
        });
        const page = await browser.newPage();
        let subjects = [];
        let URLs = await scrape.all().then((result) => result);
        console.log(URLs);


         for (let i = 0; i < URLs.length; i++) {
            const url = URLs[i];
            await page.goto(url, { waitUntil: 'domcontentloaded'});
            console.log(i);
            let singleEvent = await page.evaluate(async () => {
                try {
                   let name = await document.querySelector("h1[class~='Box-omzyfs-0'] > span").innerText
                   let placeId = await document.querySelectorAll("div[class~='Layout-sc-1j5bbdx-0'] > ul")[0].getElementsByClassName('Text-sc-1t0gn2o-0 ')[1].innerText
                   let startDateTime = await document.querySelectorAll("div[class~='Layout-sc-1j5bbdx-0'] > ul")[0].getElementsByTagName('span')[4].innerText;
                //    let endDateTime = 
                   let eventURL = window.location.href;
                   let ticketPrices;
                   let organizers;
                   let imageLink;
                   let about;
                   let ticketsLink;

                   let obj = {
                        name,
                        placeId,
                        eventURL,
                        startDateTime
                    }
                    return obj;
                } catch(e) {
                    eventName = null;
                    eventURL = null;
                    placeId = null;
                    startDateTime = null;
                }
                // subjects.push(singleEvent)
            })
            subjects.push(singleEvent)
         }
         fs.writeFile("ra-events", JSON.stringify(subjects), function(e) {
             if (e) throw e
             console.log("Saved all events. Success.")
            })
            await browser.close()
                })();


