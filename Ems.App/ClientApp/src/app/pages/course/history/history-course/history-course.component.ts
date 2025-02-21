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
    // this.breadcrumbItems.push({ label: 'ประวัติ'});
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
      format: "A4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // เพิ่มภาพพื้นหลัง
    const backgroundImage = "assets/image/bgc4.png";
    doc.addImage(backgroundImage, "PNG", 0, 0, pageWidth, pageHeight); 

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SOFTSQUARE GROUP", pageWidth / 2, 30, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35); 

    doc.setFontSize(22);
    doc.setFont("times", "bold");
    doc.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 50, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("This certificate is proudly presented to", pageWidth / 2, 70, {
      align: "center",
    });

    doc.setFontSize(24);
    doc.setFont("times", "italic", "bold");
    doc.text(`${this.user.firstname} ${this.user.lastname}`, pageWidth / 2, 90, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("For successfully completing the course", pageWidth / 2, 110, {
      align: "center",
    });

    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text(course.courseName, pageWidth / 2, 130, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(
      "In recognition of the dedication and effort demonstrated during the training.",
      pageWidth / 2,
      145,
      { align: "center" }
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(
      `This course was created and managed by the SOFTSQUARE GROUP training department.`,
      pageWidth / 2,
      160,
      { align: "center" }
    );

    // เพิ่มลายเซ็นและชื่อผู้รับรอง
    const signatureImage = "assets/image/signature.png";
    const signatureWidth = 50; 
    const signatureHeight = 20; 
    doc.addImage(
      signatureImage,
      "PNG",
      pageWidth / 2 - signatureWidth / 2,
      170,
      signatureWidth,
      signatureHeight
    );

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Mr. John Doe", pageWidth / 2, 190, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Authorized by the Training Manager, SOFTSQUARE GROUP",
      pageWidth / 2,
      215,
      { align: "center" }
    );

    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    doc.setFontSize(12);
    doc.text("Operation Manager", pageWidth / 2, pageHeight - 15, {
      align: "center",
    });
    
    // เพิ่มวันที่
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${formattedDate}`, pageWidth - 40, pageHeight - 20, {
      align: "right",
    });

    // เส้นล่างสุด
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

    doc.save(`${course.courseName}_certificate.pdf`);
}

}
