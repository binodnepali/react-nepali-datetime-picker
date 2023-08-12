# React Nepali Datetime Picker

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This component library is built with React and TailwindCSS, and it is highly customizable to meet the needs of any user. And it aims to provide a comprehensive solution for integrating Nepali calendar functionality into your React applications. It offers a collection of reusable components that will enable seamless date picking, time picking, and datetime picking capabilities.

## Available Components

* **Date Picker**: Let's user select nepali calendar date.
* **Time Picker**: Let's user select nepali time.
* **DateTime Picker**: Let's user select nepali date and time.
* **Static Calendar**: Let's user select nepali calendar date without popupover/modal.
* **Static Time**: Let's user select nepali time without popupover/modal.

## Installation

To install the React Nepali Datetime Picker library, simply use npm or yarn:

```bash
npm install react-nepali-datetime-picker
#or
yarn add react-nepali-datetime-picker
#or
pnpm add react-nepali-datetime-picker
```

## Usage

```jsx
import {
  DatePicker,
  DateTimePicker,
  StaticCalendar,
  StaticTime,
  TimePicker,
} from 'react-nepali-datetime-picker';

import 'react-nepali-datetime-picker/dist/style.css';

const MyComponent = () => {
  return (
    <>
      <DatePicker />
      <TimePicker />
      <DateTimePicker />
      <StaticCalendar />
      <StaticTime/>
    </>
  );
};

export default MyComponent;
```

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](./LICENSE) file.

## Author

* Name: Binod Nepali
* GitHub: [@binodnepali](https://github.com/binodnepali)
* Email: nepalibinod9@gmail.com
* Website: [https://binodnepali.me/](https://binodnepali.me/)

We welcome contributions from the open-source community to help us complete and improve this project. Feel free to create issues, submit pull requests, or reach out to the author for any feedback or questions.

Thank you for your interest in the React Nepali Datetime Picker! Together, we can make it a powerful tool for Nepali calendar integration in React applications.
