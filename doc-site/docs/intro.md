---
sidebar_position: 1
---

# Introduction

This component library is built with **React** and **TailwindCSS**, and it is highly customizable to meet the needs of any user. And it aims to provide a comprehensive solution for integrating Nepali calendar functionality into your React applications. It offers a collection of reusable components that will enable seamless date picking, time picking, and datetime picking capabilities.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 18.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- [Tailwind CSS](https://nodejs.org/en/download/)

## Installation

1. Install react-nepali-datetime-picker

```bash
npm install react-nepali-datetime-picker
or
yarn add react-nepali-datetime-picker
or
pnpm add react-nepali-datetime-picker
```

2. Then add `nedtTwPlugin` to your tailwind.config.js files:

```js
import {
    nedtTwPlugin,
} from 'react-nepali-datetime-picker';

module.exports = {
    //...
    plugins: [nedtTwPlugin()],
}

```