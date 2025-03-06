import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer, { Browser, Page } from "puppeteer";

describe("Blog Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = (await browser.pages())[0] || (await browser.newPage());
    await page.goto("http://localhost:3000/blog");
    await page.waitForSelector("body");
  });

  it("should Load the blog page (SSR)", async () => {
    const h1 = await page.$eval("h1", (el) => el.textContent);
    expect(h1).toBe("PhilaPrints' Latest Posts");
  });
});
