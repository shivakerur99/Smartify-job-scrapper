This Node.js script uses Puppeteer to scrape job listings from the Working Nomads website, extracts job details such as type, title, location, and description URL, then retrieves the detailed job descriptions for each listing. It inserts the scraped data into a MongoDB database while avoiding duplicates, and also writes the data to a JSON file. Finally, it provides a structured approach for the entire process, ensuring smooth execution and error handling throughout.

# how to run code
npm install

node app.js 



## 🖼️ Output

![console output](https://github.com/Leelaprasad001/Job-Listing-Scraper-Working-Nomads-Assignment/assets/76583080/3b9fbf81-f319-4f67-9142-f60a63a0f492)


check mongodb database base also you will see unique job's are stored in db