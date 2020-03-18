const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

(async () => {
  const extractFlightData = async (url) => {
    const page = await browser.newPage();

       // To ensure url doesn't detect it as a Bot
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
      });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    
        await page.goto(url);

  // DATA SCRAPING
      const date = await page.evaluate(() => Array.from(document.querySelectorAll('.layoutcell'))
      .map((layoutcell) => layoutcell.innerText).slice(1,2));  
      const departureAir = await page.evaluate(() => Array.from(document.querySelectorAll('.depdest .content'))
      .map((depdest) => depdest.innerText).slice(1,2));
      const arrivalAir = await page.evaluate(() => Array.from(document.querySelectorAll('.arrdest .content'))
      .map((arrdest) => arrdest.innerText).slice(1,2));
      const departTime = await page.evaluate(() => Array.from(document.querySelectorAll('.depdest .emphasize'))
      .map((depdest) => depdest.innerText));
      const arrivalTime = await page.evaluate(() => Array.from(document.querySelectorAll('.arrdest .emphasize'))
      .map((arrdest) => arrdest.innerText));
      const cost = await page.evaluate(() => Array.from(document.querySelectorAll('.standardlowfare .seatsokfare'))
      .map((standardlowfare) => standardlowfare.innerText));



  // RETURN DATA
    const scrapedData = {
      Date: date.toString(), 
      DepartureAirport: departureAir.toString(),
      ArrivalAirport: arrivalAir.toString(),
      DepartureTime: departTime.toString(),
      ArrivalTime: arrivalTime.toString(),
      Price: cost.toString(),
    };
    return scrapedData
  };

  // PUPPETEER SETTINGS =============
    const browser = await puppeteer.launch({
      // headless: false,
      slowMo: 250,
      defaultViewport: {width: 1920, height: 1080}
    });




  // LOOP - Calling "extractFlightData" function to receive scraped data and also it changes the day.
    let day = 1;
    let fullyScrapedData = [];

    for (let i = 1; i <= 30; i++){    
      const url = 'https://www.norwegian.com/us/ipc/availability/avaday?AdultCount=1&A_City=RIX&D_City=OSL&D_Month=202005&D_Day=' + day + '&IncludeTransit=false&TripType=1&CurrencyCode=USD&dFare=58&mode=ab';
      const answer = await extractFlightData(url); 
      console.log(answer);
      fullyScrapedData.push(answer);
      day++;
    };
    



  // EXPORT TO CSV 
    async function createCsvFile(data){
      const csv = new ObjectsToCsv(data);
 
      // Save to file:
      await csv.toDisk('./NorwegianFlightsScrape.csv');
     
      // Return the CSV file as string:
     //  console.log(await csv.toString());
   await browser.close(); 
   };
      
    await createCsvFile(fullyScrapedData);


    
      

})();

