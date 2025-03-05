import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../vitest/setup";

describe("Puppeteer Setup", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    const setupData = await setup();
    browser = setupData.browser;
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
    await page.waitForSelector("body");
  });

  afterAll(async () => {
    await teardown();
  });

  it("should Load the home page", async () => {
    const content = await page.content();
    expect(content).toContain("Custom Apparel Services");
  });
  it("should have a bulk orders section", async () => {
    const elementExists = await page.waitForSelector(".bulkOrders");

    expect(elementExists).not.toBeNull();
  });
});

console.log("Puppeteer test completed");
