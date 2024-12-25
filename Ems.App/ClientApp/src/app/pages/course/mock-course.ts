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
];
