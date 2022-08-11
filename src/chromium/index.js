// @ts-check
import core from "puppeteer-core";
import chrome from "chrome-aws-lambda";

/**@type {core.Page|null} */
let _page;

/** Will be available once deployed to google cloud */
const isDev = !process.env.FUNCTION_TARGET;
const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
// "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";

async function getPage() {
  if (_page) {
    return _page;
  }

  const browser = await core.launch({
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
      ...(isDev ? [] : chrome.args),
    ],
    executablePath: isDev ? exePath : await chrome.executablePath,
    headless: isDev ? true : chrome.headless,
  });
  _page = await browser.newPage();
  return _page;
}

/**
 * @param {string} html
 * @param {{width: number;height: number}} size
 */
export async function getScreenshot(html, size) {
  const page = await getPage();
  await page.setViewport(size);
  await page.setContent(html, { waitUntil: "networkidle0" });

  const file = await page.screenshot({ type: "png" /*,omitBackground: true*/ });
  return file;
}
