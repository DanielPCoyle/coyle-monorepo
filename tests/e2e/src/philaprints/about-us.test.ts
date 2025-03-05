import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../vitest/setup";
import puppeteer, { Browser, Page } from "puppeteer";

describe("About Us Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = (await browser.pages())[0] || (await browser.newPage());  
    await page.goto("http://localhost:3000/about-us");
    await page.waitForSelector("body");
  });

  it("should Load the about page", async () => {
    const content = await page.content();
    expect(content).toContain("Our approach");
  });

});

