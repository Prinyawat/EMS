export class AdminCourse {
  courseId: string;
  courseName: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  }

export class AdminChapter {
  chapterId: string;
  courseId: string;
  title: string;
}

export class AdminChapterContent {
  contentId: string;
  chapterId: string;
  contentTitle: string;
  body: string;
}