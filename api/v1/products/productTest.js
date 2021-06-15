const { generalUtil } = require("../../../util/generalUtils");
const util = generalUtil();
const { createTimeDateIn, convertToDoubleDateTimeValue } = generalUtil();

console.log(util.isValueEmptyString(4, { 4: 4 }, "true value is empty"));

const isInjected = (str) => {
  const injections = [
    "(\n+)",
    "(\r+)",
    "(\t+)",
    "(%0A+)",
    "(%0D+)",
    "(%08+)",
    "(%09+)",
  ];
  const inject = injections.join("|");
  const injectRegx = /inject/i;

  console.log("regx: ", injectRegx, " injectStr: ", inject);

  if (injectRegx.test(str)) {
    return true;
  } else {
    return false;
  }
};

console.log(isInjected("UNION"));
