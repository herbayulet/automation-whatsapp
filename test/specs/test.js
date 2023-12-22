const { remote } = require("webdriverio");
const mysql = require("mysql2/promise"); // Import the mysql2 library

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "192.168.180.58:5555",
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
      "INSERT INTO history_chat (message) VALUES (?)",
      [message]
    );

    // You can log the inserted row's information if needed
    console.log("Inserted row:", result);

    return result;
  } finally {
    await connection.end();
  }
};

it("Run Test", async () => {
  let driver;

  try {
    driver = await remote(wdOpts);

    // Check if WebDriver session is started
    if (!driver.sessionId) {
      console.error("WebDriver session is not started. Exiting...");
      return;
    }

    // Wait for the Appium server to be ready
    await driver.pause(5000);

    // Identify all TextView elements
    const allTextViews = await driver.$$("//android.widget.TextView");

    // Click on the TextView at index 5
    const targetIndex = 5;
    if (targetIndex < allTextViews.length) {
      await allTextViews[targetIndex].click();
      await driver.pause(2000);

      // Click on the "Search" element
      const el1 = await driver.$("~Search");
      await el1.click();

      // Wait for the "input_layout" element to be displayed
      const el2 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/input_layout")'
      );
      await el2.waitForDisplayed({ timeout: 5000 });
      await el2.click();

      // Search for the contact "yusuf"
      const el3 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/search_input")'
      );
      await el3.setValue("yusuf");

      // Click on the search result
      const el4 = await driver.$(
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.recyclerview.widget.RecyclerView/android.widget.RelativeLayout[1]/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.LinearLayout/android.widget.FrameLayout"
      );
      await el4.click();

      // Click on "text_entry_layout"
      const el5 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/text_entry_layout")'
      );
      await el5.click();

      // Click on "input_layout"
      const el6 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/input_layout")'
      );
      await el6.click();

      // Click on "entry" and set the value
      const el7 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/entry")'
      );
      await el7.click();
      const pesan = "mas ucup gue lg testing dulu sorry, tp sekarang make DB";
      await el7.setValue(pesan);

      // Insert the message into the database
      await insertMessageIntoDatabase(pesan);

      // Wait for a moment before clicking the send button
      await driver.pause(2000);

      // Click the send button
      const e8 = await driver.$(
        '//*[@resource-id="com.whatsapp:id/send_container"]'
      );
      await e8.click();
    } else {
      console.error(`Element with index ${targetIndex} not found.`);
    }
  } catch (error) {
    console.error("Error during execution:", error);
  } finally {
    if (driver) {
      console.log("Closing the driver connection...");
      await driver.deleteSession();
    }
  }
});
