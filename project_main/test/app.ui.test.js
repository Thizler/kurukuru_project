require("chromedriver"); // ใช้ Microsoft Edge WebDriver
const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Checkout Page UI Tests", function () {
    let driver;

    // Helper: login before tests that need authentication
    async function login() {
        await driver.get("http://localhost:3000/login");
        await driver.wait(until.elementLocated(By.id("username")), 5000);
        await driver.findElement(By.id("username")).sendKeys("testuser");
        await driver.findElement(By.id("password")).sendKeys("testpass");
        await driver.findElement(By.css('button[type="submit"]')).click();
        // Wait for redirect (e.g., to /menu)
        await driver.wait(until.urlContains("/menu"), 5000);
    }

    beforeEach(async function () {
        driver = await new Builder().forBrowser("MicrosoftEdge").build(); // ใช้ Microsoft Edge
    });

    afterEach(async function () {
        await driver.quit();
    });

    it("should login and redirect to menu page", async function () {
      await driver.get("http://localhost:3000/login");
      await driver.wait(until.elementLocated(By.id("username")), 5000);
      await driver.findElement(By.id("username")).sendKeys("testuser");
      await driver.findElement(By.id("password")).sendKeys("testpass");
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlContains("/menu"), 5000);
      let url = await driver.getCurrentUrl();
      assert.ok(url.includes("/menu"));
    });

    it("should show favorite page", async function () {
        await login();
        await driver.get("http://localhost:3000/favorite");
        let favElem = await driver.wait(until.elementLocated(By.css("h1")), 5000);
        let favText = await favElem.getText();
        assert.ok(favText.toLowerCase().includes("favorite"));
    });

    it("should show setting page", async function () {
        await driver.get("http://localhost:3000/setting");
        let settingElem = await driver.wait(until.elementLocated(By.css("h1")), 5000);
        let settingText = await settingElem.getText();
        assert.ok(settingText.toLowerCase().includes("setting"));
    });

    it("should show empty cart message if cart is empty", async function () {
        await login();
        await driver.get("http://localhost:3000/cart");
        let textElem = await driver.wait(until.elementLocated(By.css(".text-center")), 5000);
        let text = await textElem.getText();
        assert.ok(text.includes("Your cart is empty"));
    });

    it("should show trending page and sort dropdown", async function () {
        await login();
        await driver.get("http://localhost:3000/trending");
        let headingElem = await driver.wait(until.elementLocated(By.css("h1")), 5000);
        let heading = await headingElem.getText();
        assert.ok(heading.includes("Trending"));
        let sortDropdown = await driver.wait(until.elementLocated(By.id("sortOrder")), 5000);
        assert.ok(await sortDropdown.isDisplayed());
    });

    it("should display thank you message after checkout", async function () {
        await login();
        await driver.get("http://localhost:3000/checkout/confirm");
        let messageElem = await driver.wait(until.elementLocated(By.css("h1")), 5000);
        let message = await messageElem.getText();
        assert.strictEqual(message, "Thank You!");
    });
});