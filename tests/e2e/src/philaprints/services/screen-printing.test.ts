import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer from "puppeteer";

describe("Screen Printing Service Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = (await browser.pages())[0] || (await browser.newPage());
    const url = "http://localhost:3000/services/screen-printing";
    await page.goto(url);
    await page.waitForSelector("body");
  });

  it("should load the screen printing service page", async () => {
    const h1 = await page.$eval("h1", (el) => el.textContent);
    expect(h1).toBe("Screen Printing Services");
  });

  it("should have SSR content", async () => {
    const response = await page.goto(
      "http://localhost:3000/services/screen-printing",
    );
    const html = await response.text();
    expect(html).toContain("<h1>Screen Printing Services</h1>");
  });

  afterAll(async () => {
    await browser.close();
  });
});
