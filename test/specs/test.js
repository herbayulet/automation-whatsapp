const { remote } = require("webdriverio");
const mysql = require("mysql2/promise");

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "192.168.180.93:5555",
    "appium:platformVersion": "13.0",
    "appium:automationName": "UiAutomator2",
    "appium:noReset": true,
  },
};

const insertMessageIntoDatabase = async (message) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testing_whatsapp",
  });

  try {
    const [result] = await connection.execute(
      `INSERT INTO history_chat (message) VALUES (?)`,
      [message]
    );

    console.log("Inserted row:", result);
    return result;
  } finally {
    await connection.end();
  }
};

const runScript = async (driver, targetIndex, searchValue, message) => {
  try {
    await driver.pause(5000);

    const allTextViews = await driver.$$("//android.widget.TextView");

    if (targetIndex < allTextViews.length) {
      await allTextViews[targetIndex].click();
      await driver.pause(2000);

      const el1 = await driver.$("~Search");
      await el1.click();

      const el2 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/input_layout")'
      );
      await el2.waitForDisplayed({ timeout: 10000 });
      await el2.click();

      const el3 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/search_input")'
      );
      await el3.setValue(searchValue);

      const el4 = await driver.$(
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.recyclerview.widget.RecyclerView/android.widget.RelativeLayout[1]/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.LinearLayout/android.widget.FrameLayout"
      );
      await el4.waitForDisplayed({ timeout: 10000 });
      await el4.click();

      const el5 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/text_entry_layout")'
      );
      await el5.click();

      const el6 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/input_layout")'
      );
      await el6.click();

      const el7 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/entry")'
      );
      await el7.click();
      await el7.setValue(message);

      await insertMessageIntoDatabase(message);

      await driver.pause(2000);

      const e8 = await driver.$(
        '//*[@resource-id="com.whatsapp:id/send_container"]'
      );
      await e8.click();
      await driver.pause(2000);

      // keycode 3 untuk tombol home
      for (let i = 0; i < 3; i++) {
        await driver.pressKeyCode(4);
      }
    } else {
      console.error(`Element with index ${targetIndex} not found.`);
    }
  } catch (error) {
    console.error("Error during execution:", error);
  }
};

const deleteSessionSafely = async (driver) => {
  try {
    if (driver.sessionId) {
      await driver.deleteSession();
    }
  } catch (error) {
    console.error("Error deleting session:", error);
  }
};

describe("Test Suite", () => {
  let driver;

  before(async () => {
    try {
      driver = await remote(wdOpts);

      if (!driver.sessionId) {
        console.error("WebDriver session is not started. Exiting...");
        process.exit(1);
      }
    } catch (error) {
      console.error("Error starting WebDriver session:", error);
    }
  });

  after(async () => {
    await deleteSessionSafely(driver);
  });

  for (let i = 0; i <= 3; i++) {
    it("Run Test", async () => {
      try {
        // Run script for sim 2
        await runScript(driver, 2, "sim 2", "halo sim 2");

        // Pause and wait for any asynchronous tasks to complete
        await driver.pause(2000);

        // Press home button
        for (let i = 0; i < 3; i++) {
          await driver.pressKeyCode(4);
        }
        // Run script for sim 1
        await runScript(driver, 4, "sim 1", "halo sim 1");
        await driver.pause(2000);

        // Pause and wait for any asynchronous tasks to complete
        await driver.pause(2000);
      } catch (error) {
        console.error("Error during execution:", error);
      }
    }).timeout(60000);
  }
});
