// eslint-disable-next-line @typescript-eslint/no-var-requires
const _module = require("../index");

(async () => {
  const result = await _module.handler({ });
  console.log(result);
})();
