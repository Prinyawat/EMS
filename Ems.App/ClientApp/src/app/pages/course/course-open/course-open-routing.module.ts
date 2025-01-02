import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseOpenComponent } from './course-open.component';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import { ChapterContentComponent } from '../chapter-content/chapter-content.component';
import { ContentDetailComponent } from '../content-detail/content-detail.component';
import { QuizComponent } from '../quiz/quiz.component';

const routes: Routes = [
  { path: '', component: CourseOpenComponent },
  { path: ':courseId', component: CourseDetailComponent }, 
  { path: ':courseId/quiz', component: QuizComponent },
  { path: ':courseId/:chapterId', component: ChapterContentComponent }, 
  { path: ':courseId/:chapterId/:contentId', component: ContentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseOpenRoutingModule {}
