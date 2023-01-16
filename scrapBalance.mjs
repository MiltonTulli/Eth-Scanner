import puppeteer from "puppeteer-extra";
import { executablePath } from "puppeteer";
// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const hasBalance = (balance) => {
  const ZERO_VALUES = ["0 Ether", undefined, null, ""];
  return balance && !ZERO_VALUES.includes(balance);
};

const pupScrap = async (url, browser, cb) => {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  return cb(page, browser);
};

// Provider1
const scrapBeaconcha = (address, browser) => {
  return pupScrap(
    `https://beaconcha.in/address/${address}`,
    browser,
    async (page) => {
      await page.waitForSelector(".token-holdings", {
        visible: true,
      });
      let element = await page.$(".token-holdings");
      let value = await page.evaluate((el) => el.textContent, element);
      return value;
    }
  );
};

// Provider2
const scrapEthplorer = (address, browser) => {
  return pupScrap(
    `https://ethplorer.io/es/address/${address}`,
    browser,
    async (page) => {
      await page.waitForSelector("#address-balances-total-inner", {
        visible: true,
      });
      let element = await page.$("#address-balances-total-inner");
      let value = await page.evaluate((el) => el.textContent, element);
      return value;
    }
  );
};

export const getMultipleBalances = async (addresses) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
  });
  let values = [];
  for (let address of addresses) {
    let value = undefined;
    try {
      const beaconChain = scrapBeaconcha(address, browser);
      const ethplorer = scrapEthplorer(address, browser);
      value = await Promise.race([beaconChain, ethplorer]);
    } catch (e) {}
    values.push(value);
  }
  await browser.close();
  return values;
};
