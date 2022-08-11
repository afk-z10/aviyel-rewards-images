// @ts-check
/**
 * @typedef StringLike
 * @type string | number
 */

/**
 *
 * @param {TemplateStringsArray} strings
 * @param  {Array<StringLike | Array<StringLike>>} args
 */
function html(strings, ...args) {
  let htmlString = "";
  strings.forEach((val, index) => {
    htmlString += val;
    let arg = args[index];
    if (Array.isArray(arg)) {
      arg = arg.join("");
    }
    htmlString += arg ?? "";
  });
  return htmlString;
}

export { html };
