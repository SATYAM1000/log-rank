import { Console } from "log-rank";

const logger = new Console({
  maximumConsoleAllowed: 2,
});

logger.log("Hello world");
logger.log("Highest prioroty", {
  priority: 100,
});

logger.log("Lowest message ", {
  priority: -1,
});

//u can keep logging more messages up to the `maximumConsoleAllowed`
