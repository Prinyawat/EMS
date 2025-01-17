export class Course {
  courseId: string;
  courseName: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  statusName: string;
  display?: boolean; 
  chapters: Chapter[];
  }

  export class Chapter {
    chapterId: string;
    title: string;
    contents: Content[];
  }

  export class Content {
    contentId: string;
    contentTitle: string;
    body: string;
  }