# React Nepali Datetime Picker

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This component library is built with React and TailwindCSS, and it is highly customizable to meet the needs of any user. And it aims to provide a comprehensive solution for integrating Nepali calendar functionality into your React applications. It offers a collection of reusable components that will enable seamless date picking, time picking, and datetime picking capabilities.

## Components

- **Date Picker**: Let's user select nepali calendar date. ✅
- **Time Picker**: Let's user select nepali time. ✅
- **DateTime Picker**: Let's user select nepali date and time. ✅
- **Static Calendar**: Let's user select nepali calendar date without popupover/modal. ✅
- **Static Desktop Time**: Let's user select nepali time without popupover/modal. ✅
- **Static Mobile Time**: Let's user select nepali time with clock layout and no popupover/modal. 🚧

Demo site [link](https://react-nepali-datetime-picker.web.app)

## Before installation

You need to insall [Node.js](https://nodejs.org) and [Tailwind CSS](https://tailwindcss.com).

## Installation

1. Install react-nepali-datetime-picker

```bash
  npm install react-nepali-datetime-picker
  #or
  yarn add react-nepali-datetime-picker
  #or
  pnpm add react-nepali-datetime-picker
```

2. Then add `nedtTwPlugin` to your tailwind.config.js files:

```js
import { nedtTwPlugin } from "react-nepali-datetime-picker";

module.exports = {
  //...
  plugins: [nedtTwPlugin()],
};
```

## Usage

```jsx
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  StaticCalendar,
  StaticDesktopTime,
} from "react-nepali-datetime-picker";

import "react-nepali-datetime-picker/dist/style.css";

const MyComponent = () => {
  return (
    <>
      <DatePicker />
      <TimePicker />
      <DateTimePicker />
      <StaticCalendar />
      <StaticDesktopTime />
    </>
  );
};

export default MyComponent;
```

## Packages

### core

```json
{
  "dependencies": {
    "nepali-datetime": "1.4.1",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@types/node": "22.15.15",
    "@eslint/js": "9.25.0",
    "@types/react": "19.1.2",
    "@types/react-dom": "19.1.2",
    "@vitejs/plugin-react-swc": "3.9.0",
    "eslint": "9.25.0",
    "eslint-plugin-react-hooks": "5.2.0",
    "eslint-plugin-react-refresh": "0.4.19",
    "globals": "16.0.0",
    "typescript": "5.8.3",
    "typescript-eslint": "8.30.1",
    "vite": "6.3.5",
    "eslint-plugin-simple-import-sort": "12.1.1",
    "rollup-plugin-visualizer": "5.14.0",
    "vite-plugin-dts": "4.5.3",
    "vite-plugin-svgr": "4.3.0",
    "vitest": "3.1.1",
    "husky": "9.1.7",
    "lint-staged": "15.5.0",
    "@commitlint/cli": "19.8.0",
    "@commitlint/config-conventional": "19.8.0",
    "commit-and-tag-version": "12.5.0"
  }
}
```

### tailwindcss & shadcn/ui

```json
{
  "dependencies": {
    "@radix-ui/react-label": "2.1.6",
    "@tailwindcss/vite": "4.1.5",
    "class-variance-authority": "0.7.1",
    "lucide-react": "0.508.0",
    "tailwindcss": "4.1.5",
    "clsx": "2.1.1",
    "tailwind-merge": "3.2.0"
  },
  "devDependencies": {
    "tw-animate-css": "1.2.9"
  }
}
```

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](./LICENSE) file.

## Author

- Name: Binod Nepali
- GitHub: [@binodnepali](https://github.com/binodnepali)
- Email: nepalibinod9@gmail.com
- Website: [https://binodnepali.me/](https://binodnepali.me/)

We welcome contributions from the open-source community to help us complete and improve this project. Feel free to create issues, submit pull requests, or reach out to the author for any feedback or questions.

Thank you for your interest in the React Nepali Datetime Picker! Together, we can make it a powerful tool for Nepali calendar integration in React applications.
