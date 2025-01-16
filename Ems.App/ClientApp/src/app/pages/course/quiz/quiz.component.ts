import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/shared/services/course.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {

    course: any;
    currentQuestionIndex: number = 0;
    showSubmitDialog: boolean = false;
    showResult: boolean = false;
    score: number = 0;
    passStatus: boolean = false;

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.params['courseId']);
    this.course = this.courseService.getCourseByIds(courseId);
  }

  
  nextQuestion(): void {
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
  
  get currentQuestion() {
    return this.courseService.getCurrentQuestion(this.course.id, this.currentQuestionIndex);
  }

  onOptionSelect(optionId: number): void {
    this.courseService.updateSelectedOption(this.course.id, this.currentQuestionIndex, optionId);
  }

  submitQuiz(): void {
    this.calculateScore();
    this.showSubmitDialog = false;
    this.showResult = true;
    if (this.passStatus) {
      this.courseService.updateCourseStatus(this.course.id, 'เสร็จสิ้น');
    }
  }
  
  calculateScore(): void {
    const totalQuestions = this.course.questions.length;
    const correctAnswers = this.course.questions.filter(
      (q: any) => q.selectedOptionId === q.correctAnswer
    ).length;

    this.score = correctAnswers;
    this.passStatus = this.score >= Math.ceil(totalQuestions / 2);
    this.courseService.updateQuizResult(this.course.id, this.score, this.passStatus);
  }  

  resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.course.questions.forEach((q: any) => (q.selectedOptionId = null));
    this.showResult = false;
    this.score = 0;
    this.passStatus = false;
  }
}