import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, Question } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {

    questions: Question[] = [];
    course: Course;
    currentQuestionIndex: number = 0;

    score: number = 0;
    passStatus: boolean = false;
    
    isDirty: boolean = false;
    showResult: boolean = false;
    showSubmitDialog: boolean = false;
    showAnswerRequiredDialog: boolean = false;

    result: {
      score: number;
      totalQuestions: number;
      passStatus: boolean;
    } = {
      score: 0,
      totalQuestions: 0,
      passStatus: false,
    };

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.params['courseId'];
    this.courseService.getCourseById(courseId).subscribe((course) => {
    this.course = course;
    this.currentQuestionIndex = 0;
  });
  }

  get currentQuestion() {
    return this.course?.questions[this.currentQuestionIndex];
  }
  
  onOptionSelect(optionId: string): void {
    const question = this.course.questions[this.currentQuestionIndex];
    question.selectedOptionId = optionId;
    this.isDirty = false;
  }
  
  nextQuestion(): void {
    const question = this.currentQuestion;
    if (!question?.selectedOptionId) {
      this.isDirty = true;
      return;
    }

    this.isDirty = false;
    if (this.currentQuestionIndex === this.course.questions.length - 1) {
      this.showSubmitDialog = true;
    } else {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  saveAnswers() {
    const answers = this.course.questions.map((question) => ({
      courseId: this.course.courseId,
      questionId: question.questionId,
      optionId: question.selectedOptionId,
    }));
  
    this.courseService.saveUserAnswers(answers).subscribe({
      next: (response) => {
      },
    });
  }
  

  // resetQuiz(): void {
  //   this.currentQuestionIndex = 0;
  //   this.course.questions.forEach((q: any) => (q.selectedOptionId = null));
  //   this.showResult = false;
  //   this.score = 0;
  //   this.passStatus = false;
  // }
}