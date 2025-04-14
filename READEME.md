# log-rank

**A customizable console log utility with priority handling, message grouping, and emoji support.**

## 📦 Installation

```bash
npm install log-rank
```

or

```bash
yarn add log-rank
```

---

## 💡 Why this package?

While working on a large codebase filled with scattered `console.log()` statements, filtering relevant logs became difficult. I built **log-rank** to give structure, priority, and clarity to console outputs—especially during debugging and feature development.

---

## 🚀 Features

- Set priority for your console messages
- Supports `log`, `warn`, `error`, `success`, and `failure` message types
- Automatically clears console before reprinting grouped messages
- Emoji support for success and failure logs
- Toggle timestamps
- Control max number of messages
- Disable console globally if needed

---

## 📘 Usage

### 1. Basic Setup

```ts
import { Console } from "log-rank";

const logger = new Console({
  maximumConsoleAllowed: 100,
  isConsoleDisable: false,
  timeFormat: "ISO", // or "LOCALE"
  reversePriority: false,
});
```

### 2. Log Types

#### Log

```ts
logger.log("This is a log message", { priority: 1, showTimestamps: true });
```

#### Warn

```ts
logger.warn("This is a warning", { priority: 2 });
```

#### Error

```ts
logger.error("This is an error", { priority: 3 });
```

#### Success

```ts
logger.success("Data saved successfully", "🎉", { priority: 1 });
```

#### Failure

```ts
logger.failure("Operation failed", "💥", { priority: 1 });
```

### 3. Flush the Console Queue

```ts
logger.flush();
```

---

## ⚙️ Configuration Options

### `Console` constructor options

| Option                  | Type    | Required | Default | Description                               |
| ----------------------- | ------- | -------- | ------- | ----------------------------------------- | -------------------- |
| `maximumConsoleAllowed` | number  | ✅       | —       | Max messages allowed before stopping logs |
| `isConsoleDisable`      | boolean | ❌       | false   | Globally disable logging                  |
| `timeFormat`            | "ISO"   | "LOCALE" | ✅      | —                                         | Format of timestamps |
| `reversePriority`       | boolean | ❌       | false   | Show low priority messages first          |

---

### Logging Options

Each log method (`log`, `warn`, `error`, `success`, `failure`) accepts:

```ts
{
  priority?: number;        // Optional priority level (default: 1)
  showTimestamps?: boolean; // Whether to show timestamp (default: false)
}
```

---

## 📦 Example Output

```bash
✅ 2025-04-14T12:00:00.000Z:
Data saved successfully

❌ 2025-04-14T12:01:00.000Z:
Operation failed

2025-04-14T12:02:00.000Z:
This is a log message
```

---

## 🙌 Contribution

Pull requests and feature suggestions are welcome!

---

## 📝 License

MIT License

---

Built with ❤️ to clean up your console mess!
