const { remote } = require("webdriverio");
const mysql = require("mysql2/promise");
const { exec } = require("child_process");

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

const adbForceStop = async (packageName) => {
  return new Promise((resolve, reject) => {
    exec(`adb shell am force-stop ${packageName}`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
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
      await driver.pressKeyCode(3);
      await driver.pause(2000);
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

it("Run Test", async () => {
  let driver;

  try {
    driver = await remote(wdOpts);

    if (!driver.sessionId) {
      console.error("WebDriver session is not started. Exiting...");
      return;
    }

    await driver.pause(2000);
    await runScript(driver, 2, "sim 2", "halo sim 2");

    // keycode 3 untuk tombol home
    await driver.pressKeyCode(3);
    await driver.pause(2000);

    // Pastikan sesi masih aktif sebelum mencoba menghapus
    await deleteSessionSafely(driver);

    driver = await remote(wdOpts); // Start a new session

    await runScript(driver, 4, "sim 1", "halo sim 1");
    await driver.pause(2000);

    // Menutup aplikasi menggunakan adbForceStop
    await adbForceStop("com.whatsapp");

    // Pastikan sesi masih aktif sebelum mencoba menghapus
    await deleteSessionSafely(driver);
  } catch (error) {
    console.error("Error during execution:", error);
  } finally {
    if (driver) {
      console.log("Closing the driver connection...");
      await driver.deleteSession();
    }
  }
});
