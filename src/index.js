// @ts-check
import { z } from "zod";

import { getScreenshot } from "./chromium/index.js";
import { html } from "./utils/html.js";

const requestBodySchema = z.array(
  z.object({ image: z.string().url(), name: z.string() }).strict()
);

/**@type {import("@google-cloud/functions-framework/build/src/functions").HttpFunction} */
const rewardsImage = async (request, response) => {
  const size = {
    height: 120,
    width: 560,
  };

  if (request.method !== "POST") {
    return response.status(415).end("Method Not Allowed");
  }

  const requestBody = requestBodySchema.safeParse(request.body);

  if (!requestBody.success) {
    return response.status(400).end("Invalid Input");
  }

  try {
    const htmlString = getRewardsHTML(requestBody.data, size);

    const image = await getScreenshot(htmlString, {
      height: size.height * 2,
      width: size.width * 2,
    });

    response.status(200).setHeader("Content-Type", "image/png").end(image);
  } catch (e) {
    console.error(e);
    response
      .status(500)
      .setHeader("Content-Type", "text/html")
      .end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
  }
};

/**
 * @param {Array<{image:string;name:string}>} rewards
 * @param {{width: number;height: number}} size
 */
function getRewardsHTML(rewards, size) {
  return html`<link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400"
      rel="stylesheet"
    />
    <style>
      * {
        position: relative;
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: "Inter", sans-serif;
        height: ${size.height}px;
        width: ${size.width}px;
        display: flex;
        align-items: center;
        zoom: 2;
      }
    </style>
    <body>
      ${rewards.map(
        ({ image, name }) =>
          html`<div style="padding:8px 16px;text-align:center">
            <img
              src="${image}"
              width="80px"
              crossorigin="anonymous"
              style="margin-bottom:8px"
            />
            <div style="font-size:11px;line-height:16px;color:#464554">
              ${name}
            </div>
          </div>`
      )}
    </body>`;
}

export { rewardsImage };
