This Node.js script uses Puppeteer to scrape job listings from the Working Nomads website, extracts job details such as type, title, location, and description URL, then retrieves the detailed job descriptions for each listing. It inserts the scraped data into a MongoDB database while avoiding duplicates, and also writes the data to a JSON file. Finally, it provides a structured approach for the entire process, ensuring smooth execution and error handling throughout.

# how to run code
npm install

node app.js 



## 🖼️ Output

![console output](https://github.com/shivakerur99/Smartify-job-scrapper/blob/master/smartifyjsonoutput.jpg)


check mongodb database base also you will see unique job's are stored in db