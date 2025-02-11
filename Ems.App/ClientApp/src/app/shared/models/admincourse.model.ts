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
  contents: AdminChapterContent[]
}

export class AdminChapterContent {
  contentId: string;
  chapterId: string;
  contentTitle: string;
  body: string;
}
export class AdminQuestion {
  questionId: string;
  questionText: string;
  options: AdminOption[]
}
export class AdminOption {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
}