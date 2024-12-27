export const course = [
  {
    id: 1,
    title: 'angular',
    subtitle: 'คอร์สเรียนรู้พื้นฐาน การใช้ Angular',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    openDate: new Date(2024, 0, 15),
    closeDate: new Date(2024, 0, 20),
    openTime: '09:00',
    closeTime: '17:00',
    status: 'ลงทะเบียนแล้ว',
    chapters: [
      {
        id: 1,
        title: 'introduction',
        contents: [
          { id: 1, title: 'what-is-angular', body: 'Angular is a platform...' },
          { id: 2, title: 'angular-features', body: 'Angular offers many features...' },
        ],
      },
      {
        id: 2,
        title: 'developer-tool',
        contents: [
          { id: 1, title: 'setting-up', body: 'Setting up your environment...' },
          { id: 2, title: 'useful-tools', body: 'Some useful tools for Angular...' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'React',
    subtitle: 'คอร์สเรียนรู้พื้นฐาน การใช้ React',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    openDate: new Date(2024, 0, 25),
    closeDate: new Date(2024, 0, 30),
    openTime: '09:00',
    closeTime: '17:00',
    display: false,
    status: 'เสร็จสิ้น',
    chapters: [
      {
        id: 1,
        title: 'Introduction to React',
        contents: [
          { id: 1, title: 'React Basics', body: 'Understand the basic concepts of React, including JSX and virtual DOM.' },
          { id: 2, title: 'Component-Based Architecture', body: 'React is built on reusable components that make UI design simple.' },
        ],
      },
      {
        id: 2,
        title: 'React Developer Tools',
        contents: [
          { id: 1, title: 'Setting Up with Create React App', body: 'Learn to set up your React project quickly using Create React App.' },
          { id: 2, title: 'State Management with Redux', body: 'An overview of managing state efficiently in React using Redux.' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'C#',
    subtitle: 'คอร์สเรียนรู้พื้นฐาน การใช้ภาษา C#',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    openDate: new Date(2024, 1, 1),
    closeDate: new Date(2024, 1, 5),
    openTime: '09:00',
    closeTime: '17:00',
    display: false,
    status: 'ลงทะเบียนแล้ว',
    chapters: [
      {
        id: 1,
        title: 'Introduction to C#',
        contents: [
          { id: 1, title: 'C# Basics', body: 'Learn the basic syntax and structure of C# programming language.' },
          { id: 2, title: 'Variables and Data Types', body: 'Understand how to declare variables and use different data types in C#.' },
        ],
      },
      {
        id: 2,
        title: 'Advanced C# Concepts',
        contents: [
          { id: 1, title: 'Object-Oriented Programming', body: 'Dive into OOP concepts like classes, inheritance, and polymorphism in C#.' },
          { id: 2, title: 'Asynchronous Programming', body: 'Learn how to use async and await for asynchronous programming in C#.' },
        ],
      },
    ],
  },
];
