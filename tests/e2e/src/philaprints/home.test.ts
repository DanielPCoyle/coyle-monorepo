import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../vitest/setup";
import puppeteer, { Browser, Page } from "puppeteer";

describe("Home Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    page = (await browser.pages())[0] || (await browser.newPage());
    await page.goto("http://localhost:3000");
    await page.waitForSelector("body");
  });

  it("should Load the home page and SSR", async () => {
    // expect the first h2 to be "Custom Apparel Services"
    const h2 = await page.$eval("h2", (el) => el.textContent);
    expect(h2).toBe("Custom Apparel Services");
  });
  it("should have a bulk orders section", async () => {
    const elementExists = await page.waitForSelector(".bulkOrders");
    expect(elementExists).not.toBeNull();
  });

  it("should have a featured products section", async () => {
    const elementExists = await page.waitForSelector(".featuredProducts");
    expect(elementExists).not.toBeNull();
  });

  it("should have a get a store section", async () => {
    const elementExists = await page.waitForSelector(".getAStore");
    expect(elementExists).not.toBeNull();
  });

  it("should have a brands section", async () => {
    const elementExists = await page.waitForSelector(".brands");
    expect(elementExists).not.toBeNull();
  });

  it("should show navigation", async () => {
    const elementExists = await page.waitForSelector(".navContainer");
    expect(elementExists).not.toBeNull();
  });
});

console.log("Puppeteer test completed");
