// interface IConsoleOptions {
//   priority?: number;
//   showTimestamps?: boolean;
//   colors?: boolean;
// }
//
// type LogLevel = "debug" | "info" | "warn" | "error" | "success" | "failure";
//
// enum LogMessageType {
//   DEBUG = "debug",
//   INFO = "info",
//   WARN = "warn",
//   ERROR = "error",
//   SUCCESS = "success",
//   FAILURE = "failure",
// }
//
// enum EmojiTypes {
//   SUCCESS = "✅",
//   FAILURE = "❌",
//   INFO = "ℹ️",
//   DEBUG = "🔍",
//   WARN = "⚠️",
//   ERROR = "🛑",
// }
//
// enum ConsoleColors {
//   RESET = "\x1b[0m",
//   RED = "\x1b[31m",
//   GREEN = "\x1b[32m",
//   YELLOW = "\x1b[33m",
//   BLUE = "\x1b[34m",
//   MAGENTA = "\x1b[35m",
//   CYAN = "\x1b[36m",
//   WHITE = "\x1b[37m",
// }
//
// interface ILogMessage {
//   type: LogMessageType;
//   message: unknown;
//   emoji: string;
//   timestamp: string;
//   metadata?: Record<string, unknown>;
// }
//
// interface IConstructorOptions {
//   maximumConsoleAllowed?: number;
//   isConsoleDisabled?: boolean;
//   bufferMode?: boolean;
//   useColors?: boolean;
//   reversePriority?: boolean;
//   timestampFormat?: "iso" | "locale" | "unix";
//   minPriorityToShow?: number;
// }
//
// export class PriorityConsole {
//   private messagesToBeLogged: Record<number, ILogMessage[]>;
//   private totalConsoleMessagesCount: number;
//   private maximumConsoleAllowed: number;
//   private isConsoleDisabled: boolean;
//   private bufferMode: boolean;
//   private useColors: boolean;
//   private reversePriority: boolean;
//   private timestampFormat: "iso" | "locale" | "unix";
//   private minPriorityToShow: number;
//
//   // Maps log levels to numeric priorities
//   private levelPriorities: Record<LogLevel, number> = {
//     debug: 100,
//     info: 200,
//     warn: 300,
//     error: 400,
//     success: 500,
//     failure: 600,
//   };
//
//   constructor(options?: IConstructorOptions) {
//     const {
//       maximumConsoleAllowed = 1000,
//       isConsoleDisabled = false,
//       bufferMode = false,
//       useColors = true,
//       reversePriority = true, // Higher number = higher priority by default
//       timestampFormat = "iso",
//       minPriorityToShow = 0,
//     } = options || {};
//
//     this.maximumConsoleAllowed = maximumConsoleAllowed;
//     this.isConsoleDisabled = isConsoleDisabled;
//     this.bufferMode = bufferMode;
//     this.useColors = useColors;
//     this.reversePriority = reversePriority;
//     this.timestampFormat = timestampFormat;
//     this.minPriorityToShow = minPriorityToShow;
//
//     this.messagesToBeLogged = {};
//     this.totalConsoleMessagesCount = 0;
//   }
//
//   /**
//    * Format a timestamp based on configured format
//    */
//   private formatTimestamp(timestamp: number): string {
//     switch (this.timestampFormat) {
//       case "iso":
//         return new Date(timestamp).toISOString();
//       case "locale":
//         return new Date(timestamp).toLocaleString();
//       case "unix":
//       default:
//         return String(timestamp);
//     }
//   }
//
//   /**
//    * Prints all logged messages in priority order
//    */
//   public print(): void {
//     if (this.isConsoleDisabled) return;
//
//     // Get priorities and sort them
//     const priorities = Object.keys(this.messagesToBeLogged).map(Number);
//
//     // Sort priorities (reversePriority: true = higher numbers first)
//     priorities.sort((a, b) => (this.reversePriority ? b - a : a - b));
//
//     // Clear console once before printing
//     console.clear();
//
//     // Print messages by priority
//     for (const priority of priorities) {
//       // Skip if below minimum priority threshold
//       if (priority < this.minPriorityToShow) continue;
//
//       const messages = this.messagesToBeLogged[priority];
//
//       for (const msg of messages) {
//         let formattedMessage = `${msg.emoji} ${msg.timestamp ? `${msg.timestamp}: ` : ""}${msg.message}`;
//
//         // Add metadata if present
//         if (msg.metadata && Object.keys(msg.metadata).length > 0) {
//           formattedMessage += ` ${JSON.stringify(msg.metadata)}`;
//         }
//
//         // Apply colors if enabled
//         if (this.useColors) {
//           let color = ConsoleColors.WHITE;
//
//           switch (msg.type) {
//             case LogMessageType.ERROR:
//               color = ConsoleColors.RED;
//               break;
//             case LogMessageType.WARN:
//               color = ConsoleColors.YELLOW;
//               break;
//             case LogMessageType.SUCCESS:
//               color = ConsoleColors.GREEN;
//               break;
//             case LogMessageType.INFO:
//               color = ConsoleColors.CYAN;
//               break;
//             case LogMessageType.DEBUG:
//               color = ConsoleColors.MAGENTA;
//               break;
//             case LogMessageType.FAILURE:
//               color = ConsoleColors.RED;
//               break;
//           }
//
//           formattedMessage = `${color}${formattedMessage}${ConsoleColors.RESET}`;
//         }
//
//         switch (msg.type) {
//           case LogMessageType.ERROR:
//             console.error(formattedMessage);
//             break;
//           case LogMessageType.WARN:
//             console.warn(formattedMessage);
//             break;
//           default:
//             console.log(formattedMessage);
//         }
//       }
//     }
//
//     // Clear the message queue after printing if not in buffer mode
//     if (!this.bufferMode) {
//       this.messagesToBeLogged = {};
//     }
//   }
//
//   /**
//    * Add a log message with the specified type and options
//    */
//   private addLogMessage(
//     type: LogMessageType,
//     message: unknown,
//     options: IConsoleOptions = {},
//     emoji: string = "",
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     if (
//       this.isConsoleDisabled ||
//       this.totalConsoleMessagesCount >= this.maximumConsoleAllowed
//     ) {
//       return false;
//     }
//
//     const { priority = 1, showTimestamps = false, colors } = options;
//
//     // Override class colors setting if specified in options
//     const useColors = colors !== undefined ? colors : this.useColors;
//
//     this.totalConsoleMessagesCount++;
//
//     const logMessage: ILogMessage = {
//       type,
//       message,
//       emoji,
//       timestamp: showTimestamps ? this.formatTimestamp(Date.now()) : "",
//       metadata,
//     };
//
//     // Add to priority queue
//     if (this.messagesToBeLogged[priority]) {
//       this.messagesToBeLogged[priority].push(logMessage);
//     } else {
//       this.messagesToBeLogged[priority] = [logMessage];
//     }
//
//     // Print immediately if not in buffer mode
//     if (!this.bufferMode) {
//       this.print();
//     }
//
//     return true;
//   }
//
//   /**
//    * Reset the logger state
//    */
//   public clear(): void {
//     this.messagesToBeLogged = {};
//     this.totalConsoleMessagesCount = 0;
//     console.clear();
//   }
//
//   /**
//    * Set minimum priority threshold for displaying logs
//    */
//   public setMinPriority(priority: number): void {
//     this.minPriorityToShow = priority;
//   }
//
//   /**
//    * Toggle buffer mode on/off
//    */
//   public setBufferMode(enabled: boolean): void {
//     this.bufferMode = enabled;
//     // If turning off buffer mode, print any buffered messages
//     if (!enabled && Object.keys(this.messagesToBeLogged).length > 0) {
//       this.print();
//     }
//   }
//
//   /**
//    * Standard logging methods
//    */
//   public debug(
//     message: unknown,
//     options: IConsoleOptions = {},
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     return this.addLogMessage(
//       LogMessageType.DEBUG,
//       message,
//       options,
//       EmojiTypes.DEBUG,
//       metadata,
//     );
//   }
//
//   public info(
//     message: unknown,
//     options: IConsoleOptions = {},
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     return this.addLogMessage(
//       LogMessageType.INFO,
//       message,
//       options,
//       EmojiTypes.INFO,
//       metadata,
//     );
//   }
//
//   public log(
//     message: unknown,
//     options: IConsoleOptions = {},
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     return this.addLogMessage(
//       LogMessageType.INFO,
//       message,
//       options,
//       EmojiTypes.INFO,
//       metadata,
//     );
//   }
//
//   public warn(
//     message: unknown,
//     options: IConsoleOptions = {},
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     return this.addLogMessage(
//       LogMessageType.WARN,
//       message,
//       options,
//       EmojiTypes.WARN,
//       metadata,
//     );
//   }
//
//   public error(
//     message: unknown,
//     options: IConsoleOptions = {},
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     return this.addLogMessage(
//       LogMessageType.ERROR,
//       message,
//       options,
//       EmojiTypes.ERROR,
//       metadata,
//     );
//   }
//
//   public success(
//     message: unknown,
//     options: IConsoleOptions = {},
//     customEmoji?: string,
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     return this.addLogMessage(
//       LogMessageType.SUCCESS,
//       message,
//       options,
//       customEmoji || EmojiTypes.SUCCESS,
//       metadata,
//     );
//   }
//
//   public failure(
//     message: unknown,
//     options: IConsoleOptions = {},
//     customEmoji?: string,
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     return this.addLogMessage(
//       LogMessageType.FAILURE,
//       message,
//       options,
//       customEmoji || EmojiTypes.FAILURE,
//       metadata,
//     );
//   }
//
//   /**
//    * Conditional logging - only logs if condition is true
//    */
//   public logIf(
//     condition: boolean | (() => boolean),
//     type: LogLevel,
//     message: unknown,
//     options: IConsoleOptions = {},
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     const shouldLog = typeof condition === "function" ? condition() : condition;
//
//     if (!shouldLog) return false;
//
//     const method = this[type] as (
//       message: unknown,
//       options: IConsoleOptions,
//       metadata?: Record<string, unknown>,
//     ) => boolean;
//
//     return method.call(this, message, options, metadata);
//   }
//
//   /**
//    * Log by named level instead of numeric priority
//    */
//   public logWithLevel(
//     level: LogLevel,
//     message: unknown,
//     options: IConsoleOptions = {},
//     metadata?: Record<string, unknown>,
//   ): boolean {
//     const priority = this.levelPriorities[level] || 1;
//     const adjustedOptions = { ...options, priority };
//
//     return this[level](message, adjustedOptions, metadata);
//   }
//
//   /**
//    * Group logging
//    */
//   private groupStack: Array<{
//     label: string;
//     priority: number;
//   }> = [];
//
//   public group(label: string, priority: number = 1): void {
//     if (this.isConsoleDisabled) return;
//
//     this.groupStack.push({ label, priority });
//
//     if (!this.bufferMode) {
//       console.group(label);
//     } else {
//       this.addLogMessage(
//         LogMessageType.INFO,
//         `Group: ${label}`,
//         { priority },
//         "📂",
//       );
//     }
//   }
//
//   public groupEnd(): void {
//     if (this.isConsoleDisabled) return;
//
//     const group = this.groupStack.pop();
//
//     if (!this.bufferMode) {
//       console.groupEnd();
//     } else if (group) {
//       this.addLogMessage(
//         LogMessageType.INFO,
//         `End Group: ${group.label}`,
//         { priority: group.priority },
//         "📂",
//       );
//     }
//   }
// }
//
// // Export a default instance
// export default PriorityConsole;
