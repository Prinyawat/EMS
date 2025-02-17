import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { MenuItem, MessageService } from 'primeng/api';
import { Course } from 'src/app/shared/models/course.model';
import { UserModel } from 'src/app/shared/models/user.modal';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CourseService } from 'src/app/shared/services/course.service';


@Component({
  selector: 'app-history-course',
  templateUrl: './history-course.component.html',
  styleUrls:['./history-course.component.scss'],
  providers: [MessageService]
})
export class HistoryCourseComponent {
  
  display: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  filteredCourses: Course[] = [];
  user: UserModel = new UserModel();


  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ){}
    

  ngOnInit() {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Course'});
    this.breadcrumbItems.push({ label: 'ประวัติ'});
    this.breadcrumbItems.push({ label: 'ประวัติการเรียน', styleClass: 'custom-register'});

    this.courseService.getCompletedCourses().subscribe((courses: Course[]) => {
      this.filteredCourses = courses;
    });

    this.loadUserData();
  }

  loadUserData(){
    this.authService.getUser().subscribe({
      next: (data: any) => {
        this.user = data;
      }
    })
  }

  formatTime(time: string | Date): string {
    if (!time) return '';
    if (typeof time === 'string') {
        return time.slice(0, 5);
    }
    const date = new Date(time);
    return date.toTimeString().slice(0, 5);
  }

  exportcertificate(course: Course) {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "A4"
    });
  
    const pageWidth = doc.internal.pageSize.getWidth();
  
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SOFTSQUARE GROUP", pageWidth / 2, 50, { align: "center" });
  
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("This certificate is proudly presented to", pageWidth / 2, 70, { align: "center" });
  
    doc.setFontSize(22);
    doc.setFont("times", "italic", "bold");
    doc.text(`${this.user.firstname} ${this.user.lastname}`, pageWidth / 2, 90, { align: "center" });
  
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("For successfully completing the course", pageWidth / 2, 110, { align: "center" });
    
    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text(course.courseName, pageWidth / 2, 130, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("In recognition of the dedication and effort demonstrated during the training.", pageWidth / 2, 150, { align: "center" });
    
    doc.setFontSize(14);
  
    doc.save(`${course.courseName}_certificate.pdf`);
  }
  
}
