import { remote } from "webdriverio";
import getOTPFromEmail from "./get_email_otp.js";

const capabilities = {
  platformName: "iOS",
  // browserName: "safari",
  "appium:options": {
    automationName: "XCUITest",

    platformVersion: "16.2",
    deviceName: "iPhone 11 Pro Max",
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
  await button.click();
  await driver.pause(1000);
}

async function setValueTextField(driver, name, value) {
  const textfield = driver.$(`//XCUIElementTypeTextField[@name="${name}"]`);
  textfield.click();
  const result = await textfield.setValue(value);
  return result;
}
async function setValueSecureTextField(driver, name, value) {
  const textfield = await driver.$(
    `//XCUIElementTypeSecureTextField[@name="${name}"]`
  );
  textfield.click();
  const result = await textfield.setValue(value);
  return result;
}

// - Main Function - //
async function runTest() {
  const driver = await remote(wdOpts);
  try {
    // - màn hình đăng kí  - //
    await driver.url("https://m.facebook.com/reg/");
    await driver.pause(5000);
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
    await setValueTextField(driver, "Email address", "thongdn.2019@gmail.com"); // TODO: change email for signup
    await clickButton(driver, "Next");

    // - Màn hình nhập password - //
    await setValueSecureTextField(driver, "Password", "Thong@123456");
    await clickButton(driver, "Next");

    // - Màn hình save info login - //
    await clickButton(driver, "Save");

    // - Màn hình Agree term - //
    await clickButton(driver, "I agree");

    // - Nhập OTP - //
    await driver.pause(20000);
    let otp = "";
    do {
      otp = await getOTPFromEmail();
    } while (otp.length == 0);

    await setValueTextField(driver, "Confirmation code", otp);
    await clickButton(driver, "Next");
    await driver.pause(10000); // delay verify code

    // - Màn hình bật noti - //
    await clickButton(driver, "Skip");

    // - Màn hình update avatar - //
    await clickButton(driver, "Skip");

    // - Màn hình download app fb - //
    await clickButton(driver, "Skip");

    console.log("finish");
    await driver.pause(5000);
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);
