import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer, { Browser, Page } from "puppeteer";

describe("Blog Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = (await browser.pages())[0] || (await browser.newPage());  
    await page.goto("http://localhost:3000/services/graphic-design");
    await page.waitForSelector("body");
  });

  it("should Load the blog page", async () => {
    const content = await page.content();
    expect(content).toContain("Graphic Design");
  });

});

