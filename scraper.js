const config = require('./config');
const axios = require('axios');

const {
    LinkedinScraper,
    relevanceFilter,
    timeFilter,
    typeFilter,
    experienceLevelFilter,
    events,
} = require("linkedin-jobs-scraper");

(async () => {
    // Each scraper instance is associated with one browser.
    // Concurrent queries will run on different pages within the same browser instance.
    const scraper = new LinkedinScraper({
        headless: true,
        slowMo: 200,
        args: [
            "--lang=en-GB",
        ],
    });

    // Add listeners for scraper events
    scraper.on(events.scraper.data, (data) => {
        // console.log(
        //     data.description.length,
        //     data.descriptionHTML.length,
        //     `Query='${data.query}'`,
        //     `Location='${data.location}'`,
        //     `Id='${data.jobId}'`,
        //     `Title='${data.title}'`,
        //     `Company='${data.company ? data.company : "N/A"}'`,
        //     `Place='${data.place}'`,
        //     `Date='${data.date}'`,
        //     `Link='${data.link}'`,
        //     `applyLink='${data.applyLink ? data.applyLink : "N/A"}'`,
        //     `senorityLevel='${data.senorityLevel}'`,
        //     `function='${data.jobFunction}'`,
        //     `employmentType='${data.employmentType}'`,
        //     `industries='${data.industries}'`,
        // );
        console.log(data.description, data.title, data.jobId);
        try {
            axios.post('http://localhost:8021/jobs',
                {
                    query: data.query,
                    title: data.title,
                    company: data.company,
                    place: data.place,
                    jobId: data.jobId,
                    link: data.link,
                    applyLink: data.applyLink
                }, { headers: { "Content-type": "application/json" } });
        }
        catch (e) {
            console.error(e)
        }
    });

    scraper.on(events.scraper.error, (err) => {
        console.error(err);
    });

    scraper.on(events.scraper.end, () => {
        console.log('All done!');
    });

    // Add listeners for puppeteer browser events
    scraper.on(events.puppeteer.browser.targetcreated, () => {
    });
    scraper.on(events.puppeteer.browser.targetchanged, () => {
    });
    scraper.on(events.puppeteer.browser.targetdestroyed, () => {
    });
    scraper.on(events.puppeteer.browser.disconnected, () => {
    });

    // Custom function executed on browser side to extract job description
    const descriptionFn = () => document.querySelector(".description__text")
        .innerText
        .replace(/[\s\n\r]+/g, " ")
        .trim();

    // Run queries concurrently    
    await Promise.all([
        // scraper.run({
        //     query: "Web Developer",
        //     options: {
        //         locations: ["Athens"],
        //         descriptionFn: descriptionFn,
        //         filters: {
        //             relevance: relevanceFilter.RELEVANT,
        //             time: timeFilter.MONTH,
        //         }
        //     }
        // })

        // Run queries serially
        scraper.run([
            {
                query: config.position,
                options: {
                    locations: config.locations,
                    filters: {
                        type: [typeFilter.FULL_TIME]
                    },
                    limit: config.queryLimit
                }
            }
        ], { // Global options for this run, will be merged individually with each query options (if any)
            optimize: true
        })
    ]);
    // Close browser
    await scraper.close();
})();