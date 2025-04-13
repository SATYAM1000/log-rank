interface ILogOptions {
  priority?: number;
}

interface IConsoleMessageType {
  type: "error" | "log" | "warn";
  consoleData: unknown;
}

type ConsoleMappingType = Record<number, IConsoleMessageType[]>;
const consoleMapping: ConsoleMappingType = [];

function log(consoleData: unknown, { priority = 1 }: ILogOptions) {
  if (consoleData) {
    console.clear();
  }
  if (consoleMapping[priority]) {
    consoleMapping[priority].push({
      type: "log",
      consoleData: consoleData,
    });
  } else {
    consoleMapping[priority] = [
      {
        type: "log",
        consoleData: consoleData,
      },
    ];
  }

  print();
}

function warn(consoleData: unknown, { priority = 1 }: ILogOptions) {
  if (consoleData) {
    console.clear();
  }
  if (consoleMapping[priority]) {
    consoleMapping[priority].push({
      type: "warn",
      consoleData: consoleData,
    });
  } else {
    consoleMapping[priority] = [
      {
        type: "warn",
        consoleData: consoleData,
      },
    ];
  }

  print();
}

function error(consoleData: unknown, { priority = 1 }: ILogOptions) {
  if (consoleData) {
    console.clear();
  }
  if (consoleMapping[priority]) {
    consoleMapping[priority].push({
      type: "error",
      consoleData: consoleData,
    });
  } else {
    consoleMapping[priority] = [
      {
        type: "error",
        consoleData: consoleData,
      },
    ];
  }

  print();
}

function print() {
  const arrayOfPriorityToTextArray = Object.entries(consoleMapping);
  const sortedArray = arrayOfPriorityToTextArray.sort((a, b) => {
    return Number(b[0]) - Number(a[0]);
  });

  sortedArray.forEach((arrayOfStrings) => {
    arrayOfStrings[1].forEach((textForConsoleWithType) => {
      if (textForConsoleWithType.type === "log") {
        console.log("🛠️ ", textForConsoleWithType.consoleData);
      } else if (textForConsoleWithType.type === "error") {
        console.error("❌  ", textForConsoleWithType.consoleData);
      } else if (textForConsoleWithType.type === "warn") {
        console.warn("⚠️ ", textForConsoleWithType.consoleData);
      } else {
        throw new Error(`Invalid console log type assigned`);
      }
    });
  });
}

// export const Console = {
//   log: log,
//   warn: warn,
//   print: print,
//   error: error,
// };

interface IConsoleOptions {
  priority?: number;
  showTimestamps?: boolean;
}

enum logMessagesType {
  ERROR = "error",
  WARN = "warn",
  LOG = "log",
  SUCCESS = "success",
  FAILURE = "failure",
}

enum emojiTypes {
  SUCCESS = "✅️",
  FAILURE = "❌",
}

interface IConstructor {
  maximumConsoleAllowed: number;
  isConsoleDisable?: boolean;
}

export class Console {
  private messagesToBeLogged: Record<
    number,
    {
      type: logMessagesType;
      message: unknown;
      emoji: string;
      timestamp: string;
    }[]
  >;
  private totalConsoleMessagesCount: number;
  private maximumConsoleAllowed: number;
  private isConsoleDisable?: boolean;

  constructor({
    isConsoleDisable = false,
    maximumConsoleAllowed,
  }: IConstructor) {
    this.maximumConsoleAllowed = maximumConsoleAllowed;
    this.isConsoleDisable = isConsoleDisable;
    this.messagesToBeLogged = {};
    this.totalConsoleMessagesCount = 0;
  }

  private print() {
    if (this.isConsoleDisable) return;

    const sortedMessagesBasedOnPriority = Object.entries(
      this.messagesToBeLogged,
    ).sort((a, b) => Number(a[0]) - Number(b[0]));

    sortedMessagesBasedOnPriority.forEach(([_priority, arrayOfMessages]) => {
      arrayOfMessages.forEach((messageData) => {
        if (
          messageData.type === logMessagesType.LOG ||
          messageData.type === logMessagesType.FAILURE ||
          messageData.type === logMessagesType.SUCCESS
        ) {
          console.log(
            `${messageData.emoji} ${messageData.timestamp}: ${JSON.parse(messageData.message as string)}`,
          );
        } else if (messageData.type === logMessagesType.ERROR) {
          console.error(
            `${messageData.emoji} ${messageData.timestamp}: ${messageData.message}`,
          );
        } else if (messageData.type === logMessagesType.WARN) {
          console.warn(
            `${messageData.emoji} ${messageData.timestamp}: ${messageData.message}`,
          );
        } else {
        }
      });
    });
  }

  public log(
    consoleMessage: unknown,
    { priority = 1, showTimestamps = false }: IConsoleOptions,
  ) {
    if (
      this.isConsoleDisable ||
      this.totalConsoleMessagesCount > this.maximumConsoleAllowed
    )
      return;

    console.log("Consone ,essage is ", consoleMessage);

    const message = {
      type: logMessagesType.LOG,
      message: JSON.stringify(consoleMessage),
      timestamp: showTimestamps ? new Date().toISOString() : "",
      emoji: "",
    };

    if (this.messagesToBeLogged[priority]) {
      this.messagesToBeLogged[priority].push(message);
    } else {
      this.messagesToBeLogged[priority] = [message];
    }

    this.totalConsoleMessagesCount++;

    this.print();
  }

  public error(
    consoleMessage: unknown,
    { priority = 1, showTimestamps = false }: IConsoleOptions,
  ) {
    if (
      this.isConsoleDisable ||
      this.totalConsoleMessagesCount > this.maximumConsoleAllowed
    )
      return;

    console.clear();

    const message = {
      type: logMessagesType.ERROR,
      message: consoleMessage,
      timestamp: showTimestamps ? new Date().toISOString() : "",
      emoji: "",
    };

    if (this.messagesToBeLogged[priority]) {
      this.messagesToBeLogged[priority].push(message);
    } else {
      this.messagesToBeLogged[priority] = [message];
    }
    this.totalConsoleMessagesCount++;
    this.print();
  }

  public warn(
    consoleMessage: unknown,
    { priority = 1, showTimestamps = false }: IConsoleOptions,
  ) {
    if (
      this.isConsoleDisable ||
      this.totalConsoleMessagesCount > this.maximumConsoleAllowed
    )
      return;

    console.clear();

    const message = {
      type: logMessagesType.WARN,
      message: consoleMessage,
      timestamp: showTimestamps ? new Date().toISOString() : "",
      emoji: "",
    };

    if (this.messagesToBeLogged[priority]) {
      this.messagesToBeLogged[priority].push(message);
    } else {
      this.messagesToBeLogged[priority] = [message];
    }

    this.totalConsoleMessagesCount++;
    this.print();
  }

  public success(
    consoleMessage: unknown,
    successIcon: string = "✅️",
    { priority = 1, showTimestamps = false }: IConsoleOptions,
  ) {
    if (
      this.isConsoleDisable ||
      this.totalConsoleMessagesCount > this.maximumConsoleAllowed
    )
      return;
    console.clear();
    const message = {
      type: logMessagesType.SUCCESS,
      message: consoleMessage,
      timestamp: showTimestamps ? new Date().toISOString() : "",
      emoji: successIcon,
    };

    if (this.messagesToBeLogged[priority]) {
      this.messagesToBeLogged[priority].push(message);
    } else {
      this.messagesToBeLogged[priority] = [message];
    }
    this.totalConsoleMessagesCount++;
    this.print();
  }

  public failure(
    consoleMessage: unknown,
    failureIcon: string = "❌",
    { priority = 1, showTimestamps = false }: IConsoleOptions,
  ) {
    if (
      this.isConsoleDisable ||
      this.totalConsoleMessagesCount > this.maximumConsoleAllowed
    )
      return;

    console.clear();

    if (
      this.isConsoleDisable ||
      this.totalConsoleMessagesCount > this.maximumConsoleAllowed
    )
      return;

    const message = {
      type: logMessagesType.FAILURE,
      message: consoleMessage,
      timestamp: showTimestamps ? new Date().toISOString() : "",
      emoji: failureIcon,
    };

    if (this.messagesToBeLogged[priority]) {
      this.messagesToBeLogged[priority].push(message);
    } else {
      this.messagesToBeLogged[priority] = [message];
    }
    this.totalConsoleMessagesCount++;
    this.print();
  }
}
