interface IConsoleOptions {
  priority?: number;
  showTimestamp?: boolean | undefined;
}

enum logMessagesType {
  ERROR = "error",
  WARN = "warn",
  LOG = "log",
  SUCCESS = "success",
  FAILURE = "failure",
}

interface IConstructor {
  maximumConsoleAllowed: number;
  isConsoleDisable?: boolean;
  timeFormat?: "ISO" | "LOCALE";
  reversePriority?: boolean;
  showTimestamps?: boolean;
}

interface IMessage {
  type: logMessagesType;
  message: unknown;
  emoji: string;
  timestamp: string;
}

export class Console {
  private messagesToBeLogged: Record<number, IMessage[]>;
  private totalConsoleMessagesCount: number;
  private maximumConsoleAllowed: number;
  private isConsoleDisable: boolean;
  private reversePriority: boolean;
  private timeFormat: "ISO" | "LOCALE";
  private showTimestamps: boolean;

  constructor({
    isConsoleDisable = false,
    maximumConsoleAllowed,
    reversePriority = false,
    timeFormat = "ISO",
    showTimestamps = false,
  }: IConstructor) {
    this.maximumConsoleAllowed = maximumConsoleAllowed;
    this.isConsoleDisable = isConsoleDisable;
    this.reversePriority = reversePriority;
    this.timeFormat = timeFormat;
    this.showTimestamps = showTimestamps;
    this.messagesToBeLogged = {};
    this.totalConsoleMessagesCount = 0;
  }

  private getFormattedTimestamp(): string {
    return this.timeFormat === "ISO"
      ? new Date().toISOString()
      : new Date().toLocaleString();
  }

  private print() {
    if (this.isConsoleDisable) return;

    console.clear();

    const sortedMessages = Object.entries(this.messagesToBeLogged).sort(
      (a, b) =>
        this.reversePriority
          ? Number(a[0]) - Number(b[0])
          : Number(b[0]) - Number(a[0]),
    );

    sortedMessages.forEach(([, messages]) => {
      messages.forEach(({ type, message, emoji, timestamp }) => {
        const prefix = timestamp ? `${emoji} ${timestamp}:` : `${emoji}`;
        switch (type) {
          case logMessagesType.ERROR:
            console.error(`${prefix} ${message}`);
            break;
          case logMessagesType.WARN:
            console.warn(`${prefix} ${message}`);
            break;
          case logMessagesType.LOG:
          case logMessagesType.SUCCESS:
          case logMessagesType.FAILURE:
            console.log(`${prefix}`);
            console.log(message);
            break;
        }
      });
    });
  }

  private addMessage(
    type: logMessagesType,
    consoleMessage: unknown,
    emoji: string,
    { priority = 1, showTimestamp }: IConsoleOptions,
  ) {
    if (
      this.isConsoleDisable ||
      this.totalConsoleMessagesCount >= this.maximumConsoleAllowed
    )
      return;

    const shouldShowTimestamp =
      showTimestamp !== undefined ? showTimestamp : this.showTimestamps;

    const timestamp = shouldShowTimestamp ? this.getFormattedTimestamp() : "";

    const message: IMessage = {
      type,
      message: consoleMessage,
      emoji,
      timestamp,
    };

    if (!this.messagesToBeLogged[priority]) {
      this.messagesToBeLogged[priority] = [];
    }

    this.messagesToBeLogged[priority].push(message);
    this.totalConsoleMessagesCount++;

    this.print();
  }

  public log(consoleMessage: unknown, options: IConsoleOptions = {}) {
    this.addMessage(logMessagesType.LOG, consoleMessage, "", options);
  }

  public error(consoleMessage: unknown, options: IConsoleOptions = {}) {
    this.addMessage(logMessagesType.ERROR, consoleMessage, "", options);
  }

  public warn(consoleMessage: unknown, options: IConsoleOptions = {}) {
    this.addMessage(logMessagesType.WARN, consoleMessage, "", options);
  }

  public success(
    consoleMessage: unknown,
    successIcon: string = "✅️",
    options: IConsoleOptions = {},
  ) {
    this.addMessage(
      logMessagesType.SUCCESS,
      consoleMessage,
      successIcon,
      options,
    );
  }

  public failure(
    consoleMessage: unknown,
    failureIcon: string = "❌",
    options: IConsoleOptions = {},
  ) {
    this.addMessage(
      logMessagesType.FAILURE,
      consoleMessage,
      failureIcon,
      options,
    );
  }

  public flush() {
    this.messagesToBeLogged = {};
    this.totalConsoleMessagesCount = 0;
  }
}
