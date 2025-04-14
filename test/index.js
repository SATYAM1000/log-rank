import { Console } from "log-rank";

const logger = new Console({
  maximumConsoleAllowed: 3,
  timeFormat: "LOCALE",
  showTimestamps: true,
});

logger.log("Hello world");
logger.log("Highest prioroty", {
  priority: 100,
});

logger.log("Lowest message ", {
  priority: -1,
});

logger.log("Most priority", {
  priority: 500,
  showTimestamps: false,
});

//u can keep logging more messages up to the `maximumConsoleAllowed`
