import { Component, OnInit} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Course } from 'src/app/shared/models/course.model';
import { CourseService } from 'src/app/shared/services/course.service';


@Component({
  selector: 'app-course-open',
  templateUrl: './course-open.component.html',
  styleUrls:['./course-open.component.scss'],
  providers: []

})
export class CourseOpenComponent implements OnInit{

  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  
  filteredCourses: Course[] = [];
  completedCourses: Course[] = [];
  

  constructor(
    private courseService: CourseService
  ){}

  ngOnInit(): void {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'หลักสูตร' });
    this.breadcrumbItems.push({ label: 'หลักสูตรเปิดเรียน', styleClass: 'custom-register' });
  
    this.fetchCourses();
  }

  fetchCourses() {
    this.courseService.getRegisteredCourses().subscribe((registeredCourses: Course[]) => {
      this.courseService.getCompletedCourses().subscribe((completedCourses: Course[]) => {
        this.completedCourses = completedCourses;
  
        const now = new Date();
  
        this.filteredCourses = registeredCourses
          .map((course) => {
            const completedCourse = this.completedCourses.find((c) => c.courseId === course.courseId);
  
            if (completedCourse) {
              course.statusName = completedCourse.statusName; // "เสร็จสิ้น" หรือ "ไม่ผ่าน"
            } else {
              const startDateTime = new Date(course.startDate);
              const [startHours, startMinutes] = course.startTime.split(':').map(Number);
              startDateTime.setHours(startHours, startMinutes);
  
              if (now < startDateTime) {
                course.statusName = 'รอเปิด';
              } else {
                course.statusName = 'เปิดแล้ว';
              }
            }
            return course;
          })
          .filter((course) => {
            const endDateTime = new Date(course.endDate);
            const [endHours, endMinutes] = course.endTime.split(':').map(Number);
            endDateTime.setHours(endHours, endMinutes);
  
            return now < endDateTime || (course.statusName !== 'เสร็จสิ้น' && course.statusName !== 'ไม่ผ่าน');
          });
      });
    });
  }
  
  isCourseAvailable(course: Course): boolean {
    const now = new Date();
    const startDateTime = new Date(course.startDate);
    const [hours, minutes] = course.startTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes);
  
    return now >= startDateTime; 
  }
  

  formatTime(time: string | Date): string {
    if (!time) return '';
    if (typeof time === 'string') {
        return time.slice(0, 5);
    }
    const date = new Date(time);
    return date.toTimeString().slice(0, 5);
  }

}
