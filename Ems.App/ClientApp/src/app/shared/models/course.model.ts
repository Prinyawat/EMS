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
  questions: Question[];
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
    recordRead: boolean;
  }

  export class Question {
    questionId: string;
    questionText: string;
    options: Option[];
    selectedOptionId?: string;
  }
  export class Option {
    optionId: string;
    optionText: string;
    isCorrect: boolean;
  }  
  export class UserResultModel {
    resultId: string;
    userId: string;
    courseId: string;
    score: number;
    totalQuestions: number;
    passStatus: boolean; 
  }