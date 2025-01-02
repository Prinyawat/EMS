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

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.params['courseId']);
    this.course = this.courseService.getCourses().find((c) => c.id === courseId);
  }

  
  nextQuestion(): void {
    const nextQuestion = this.courseService.getNextQuestion(this.course.id, this.currentQuestionIndex);
    if (nextQuestion) {
      this.currentQuestionIndex++;
    }
  }

  
  previousQuestion(): void {
    const previousQuestion = this.courseService.getPreviousQuestion(this.course.id, this.currentQuestionIndex);
    if (previousQuestion) {
      this.currentQuestionIndex--;
    }
  }

  
  get currentQuestion() {
    return this.courseService.getCurrentQuestion(this.course.id, this.currentQuestionIndex);
  }
}
