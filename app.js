const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
const fs = require('fs');

// MongoDB connection URI
const uri = 'mongodb+srv://shivakerur99:shivanand99805257@cluster0.usva3cf.mongodb.net/'; 
const client = new MongoClient(uri);

async function scrapeData(url) {
    console.log('Scraping job listings from Working Nomads...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector('.jobs-list');

    const jobs = await page.evaluate(() => {
        const jobElements = document.querySelectorAll('.jobs-list > .ng-scope');
        const jobData = [];

        jobElements.forEach(job => {
            const jobType = job.querySelector('.category')?.textContent.trim() || 'NA';
            const jobTitle = job.querySelector('h4 a')?.textContent.trim() || 'NA';
            const jobLocation = job.querySelector('.box .fa-map-marker + span')?.textContent.trim() || 'NA';
            const jobDescriptionUrl = job.querySelector('h4 a')?.href || 'NA';
            const companyName = job.querySelector('.company a')?.textContent.trim() || 'NA';
            const companyWebsite = job.querySelector('.company a')?.href || 'NA';

            jobData.push({
                jobType,
                jobTitle,
                jobLocation,
                jobDescriptionUrl,
                companyName,
                companyWebsite
            });
        });

        return jobData;
    });

    await browser.close();
    console.log('Job listings scraped successfully!');
    return jobs;
}

async function scrapeDescription(url) {
    console.log('Scraping job description from:', url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector('p');

    const description = await page.evaluate(() => {
        const paragraphs = Array.from(document.querySelectorAll('p'));
        return paragraphs.map(p => p.textContent.trim());
    });

    await browser.close();
    console.log('Job description scraped successfully!');
    return description;
}

async function insertDataIntoMongoDB(data) {
    console.log('Inserting data into MongoDB...');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('jobsDB');
        const collection = database.collection('jobs');

        for (const job of data) {
            const description = await scrapeDescription(job.jobDescriptionUrl);
            job.Description = description;

            const filter = { jobDescriptionUrl: job.jobDescriptionUrl };
            const options = { upsert: true };

            await collection.updateOne(filter, { $set: job }, options);
        }

        console.log('Data inserted into MongoDB successfully!');

        fs.writeFileSync('scrapedJobData.json', JSON.stringify(data, null, 2));
        console.log('Data written to JSON file successfully!');
    } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
    } finally {
        await client.close();
    }
}

async function main() {
    try {
        const url = "https://www.workingnomads.com/jobs";
        const scrapedData = await scrapeData(url);
        await insertDataIntoMongoDB(scrapedData);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
