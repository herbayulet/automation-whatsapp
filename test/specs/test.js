const { remote } = require("webdriverio");

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

it("Run Test", async () => {
  let driver;

  try {
    driver = await remote(wdOpts);

    // Menunggu sebentar setelah inisialisasi driver
    await driver.pause(2000);

    // Mengidentifikasi semua elemen TextView
    const allTextViews = await driver.$$("//android.widget.TextView");

    // Klik elemen dengan indeks 32
    const targetIndex = 5;

    if (targetIndex < allTextViews.length) {
      await allTextViews[targetIndex].click();

      // Menunggu sebentar setelah klik elemen
      await driver.pause(2000);
      let el1 = await driver.$("~Search");
      el1.click();

      // Menunggu elemen "search_input" muncul
      const el2 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/input_layout")'
      );
      await el2.click();

      let el3 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/search_input")'
      );
      await el3.setValue("yusuf");

      const el4 = await driver.$(
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.recyclerview.widget.RecyclerView/android.widget.RelativeLayout[1]/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.LinearLayout/android.widget.FrameLayout"
      );
      await el4.click();

      let el5 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/text_entry_layout")'
      );
      el5.click();
      let el6 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/input_layout")'
      );
      el6.click();
      let el7 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/entry")'
      );
      el7.click();
      el7.setValue("mas ucup gue lg testing dulu sorry");

      const e8 = await driver.$(
        'android=new UiSelector().resourceId("com.whatsapp:id/send_container")'
      );
      await e8.click();
    } else {
      console.error(`Elemen dengan indeks ${targetIndex} tidak ditemukan.`);
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    if (driver) {
      console.log("Menutup koneksi driver...");
      await driver.deleteSession();
    }
  }
});
