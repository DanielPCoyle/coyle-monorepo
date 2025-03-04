import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown, page } from "../vitest/setup";

describe("Puppeteer Setup", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    const setupData = await setup();
    browser = setupData.browser;
    page = await browser.newPage();
  });

  afterAll(async () => {
    await teardown();
  });

  it("should launch Puppeteer and open a page", async () => {
    await page.goto("http://localhost:3001");
    await page.waitForSelector("body");
    const content = await page.content();
    expect(content).toContain("Custom Apparel Services");
  });
});

console.log("Puppeteer test completed");
