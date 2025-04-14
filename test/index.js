import { Console } from "log-rank";

const logger = new Console({
  maximumConsoleAllowed: 10,
  timeFormat: "ISO", // not currently used inside messages, can be extended
  isConsoleDisable: false,
  reversePriority: false,
});

logger.log("This is a normal log message", {
  priority: 2,
  showTimestamps: true,
});

logger.warn("This is a warning message", { priority: 3, showTimestamps: true });

logger.error("Something went wrong!", { priority: 1, showTimestamps: true });

logger.success("Operation completed successfully", "🎉", {
  priority: 2,
  showTimestamps: true,
});

logger.failure("Operation failed due to invalid input", "💥", {
  priority: 2,
  showTimestamps: true,
});

//u can keep logging more messages up to the `maximumConsoleAllowed`
