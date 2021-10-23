#!/usr/bin/node
// const axios = require('axios');
// const cheerio = require('cheerio');
// const { data } = require('cheerio/lib/api/attributes');
// const { title } = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const moment = require('moment');


// while (document.querySelectorAll("span[class~='Text-sc-1t0gn2o-0']")[32] !== "No results found") {
// }

let mergedLinks = [];


let parseResidentAdvisorEvents = async (link) => {
    
    let step = 0; // Initial date (increments by week);
    let currentDate = (step) => moment().add(step, 'days').format().slice(0, 10); // From Moment.js npm;
    let locationName = function (place = 'moscow') {
        return place;
    } // Default location = 'string';
    let urlRA = () => `https://ra.co/events/${locationName()}/${currentDate(step)}`;
    
        try {
            const browser = await puppeteer.launch({ headless: false,
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true
            });
            const page = await browser.newPage();
            await page.goto(link, { waitUntil: 'domcontentloaded' });
            let dataOnPage = await page.evaluate(() => {
                let links = [];
                // let container = document.querySelectorAll("section")[1]; // Вторая секция
                let linksList = document.querySelectorAll("h3[class~='Box-omzyfs-0'] > a"); // Все ссылки по конкретной неделе
                linksList.forEach((item) => links.push(item.href));
                let linksSet = new Set(links); // Сет чтобы избавистся от дублей
                let arrayLinks = [...linksSet]; // Получаем ссылки на уникальные эвенты
                return arrayLinks;
            })
            await page.close();
            console.log(dataOnPage)
            if (dataOnPage.length < 1) {
                return dataOnPage;
            } else {
                step += 7;
                let nextUrl = `https://ra.co/events/${locationName()}/${currentDate(step)}`;
                return mergedLinks.concat(await parseResidentAdvisorEvents(nextUrl))
            }
        }
            catch(e) {
                console.log(e);
            }
    }

    parseResidentAdvisorEvents(urlRA())
    
            

                // for (let i = 0; i < linkData.length; i++) {
                //     let scrapePage = async (linkData) => {
                //         await page.goto(linkData[i], { waitUntil: 'domcontentloaded'});
                //         // await page.waitForSelector('div.Box-omzyfs-0.Alignment-sc-1fjm9oq-0.dNuPDy > h1').catch((e) => console.log(e));
            
                //         let singleEvent = await page.evaluate(async => {
                //             let res = [];
                //             try {
                //                let name = document.querySelector("h1[class~='Box-omzyfs-0'] > span").innerText;
                //                let placeId = document.querySelectorAll("div[class~='Layout-sc-1j5bbdx-0'] > ul")[0].getElementsByClassName('Text-sc-1t0gn2o-0 ')[1].innerText;
                //                let startDateTime = document.querySelectorAll("div[class~='Layout-sc-1j5bbdx-0'] > ul")[0].getElementsByClassName('Link__AnchorWrapper-k7o46r-1')[1].innerText;
                //                let eventURL = window.location.href;
                //                let endDateTime;
                //                let ticketPrices;
                //                let organizers;
                //                let imageLink;
                //                let about;
                //                let ticketsLink;
            
                //                res.push({
                //                     name,
                //                     placeId,
                //                     eventURL,
                //                     startDateTime
                //                 })
                //             } catch(e) {
                //                 eventName = null;
                //                 eventURL = null;
                //                 placeId = null;
                //                 startDateTime = null;
                //             }
                //             return res;
                //         })
                //         console.log(singleEvent);
                //     }
                   
                // }
                // console.log(data);
  
  