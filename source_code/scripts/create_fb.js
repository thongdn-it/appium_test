import { remote } from "webdriverio";

const capabilities = {
  platformName: "iOS",
  // browserName: "safari",
  "appium:options": {
    automationName: "XCUITest",

    platformVersion: "16.2",
    deviceName: "iPhone 8 Plus",
  },
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
};

// - Utils - //
async function clickButton(driver, name) {
  const button = await driver.$(`//XCUIElementTypeButton[@name="${name}"]`);
  return await button.click();
}

async function setValueTextField(driver, name, value) {
  const textfield = await driver.$(
    `//XCUIElementTypeTextField[@name="${name}"]`
  );
  return await textfield.setValue(value);
}
async function setValueSecureTextField(driver, name, value) {
  const textfield = await driver.$(
    `//XCUIElementTypeSecureTextField[@name="${name}"]`
  );
  return await textfield.setValue(value);
}

// - Main Function - //
async function runTest() {
  const driver = await remote(wdOpts);
  try {
    // - màn hình đăng kí  - //
    await driver.url("https://m.facebook.com/reg/");

    await clickButton(driver, "Get Started");

    // - Màn hình nhập tên - //
    await setValueTextField(driver, "First name", "Thong");
    await setValueTextField(driver, "Surname", "Dang");
    await clickButton(driver, "Next");

    // - Màn hình nhập ngày sinh - //
    const tfDOB = await driver.$(
      '//XCUIElementTypeOther[contains(@name, "Date of birth")]'
    );
    await tfDOB.click();

    // const btnReset = await driver.$('//XCUIElementTypeButton[@name="Reset"]');
    // btnReset.click();

    await clickButton(driver, "Show year picker");

    const wheels = await driver.$$("//XCUIElementTypePickerWheel[@*]");
    if (wheels.length > 1) {
      await wheels[0].addValue("April");
      await wheels[1].addValue("1993");
    }
    await clickButton(driver, "Hide year picker");

    const btn19April = await driver.$(
      '//XCUIElementTypeButton[contains(@name, "April 19")]'
    );
    await btn19April.click();

    await clickButton(driver, "Done");

    await clickButton(driver, "Next");

    // - Màn hình giới tính - //
    const btnMale = await driver.$('//XCUIElementTypeOther[@name="Male"]');
    await btnMale.click();

    await clickButton(driver, "Next");

    // - Màn hình chọn sign up with email - //
    await clickButton(driver, "Sign up with email address");

    // - Màn hình nhập email - //
    await setValueTextField(
      driver,
      "Email address",
      "thongdn.appium.01@gmail.com"
    );
    await clickButton(driver, "Next");

    // - Màn hình nhập password - //
    await setValueSecureTextField(driver, "Password", "Thong@123456");
    await clickButton(driver, "Next");

    // - Màn hình save info login - //
    await clickButton(driver, "Save");

    // - Màn hình Agree term - //
    await clickButton(driver, "I agree");
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);
