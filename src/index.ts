import { Console } from "./console";

const logger = new Console({
  maximumConsoleAllowed: 20,
  isConsoleDisable: false,
});
//
// logger.log("This is sample log message with priority 1", {
//   priority: 1,
//   showTimestamps: true,
// });

logger.log(
  {
    text: "This is sample log message with priority 2",
    method: "GET",
  },
  {
    priority: 2,
    showTimestamps: true,
  },
);
