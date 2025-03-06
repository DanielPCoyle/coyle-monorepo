import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer, { Browser, Page } from "puppeteer";

describe("Graphic Design Service Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    page = (await browser.pages())[0] || (await browser.newPage());
    await page.goto("http://localhost:3000/services/graphic-design");
    await page.waitForSelector("body");
  });

  it("should Load the graphic design service page", async () => {
    const h1 = await page.$eval("h1", (el) => el.textContent);
    expect(h1).toBe("Graphic Design");
  });
});
