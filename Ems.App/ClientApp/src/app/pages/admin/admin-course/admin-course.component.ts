import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Course } from 'src/app/shared/models/course.model';
import { AdminCourseService } from 'src/app/shared/services/admincourse.service';
import { CourseService } from 'src/app/shared/services/course.service';


@Component({
  selector: 'app-manage-user',
  templateUrl: './admin-course.component.html',
  styleUrls:['./admin-course.component.scss'],
  providers: [MessageService]

})
export class AdminCourseComponent implements OnInit{ 
  
  breadcrumbItems: MenuItem[] = [];
  course: Course [] = [];

  additionalDescription: string = '';

  courseName: string = '';
  subtitle: string = '';
  startDate!: Date;
  endDate!: Date;
  startTime!: Date;
  endTime!: Date;
  description: string = '';

  
  loading: boolean = true;
  display: boolean = false;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private courseService: CourseService,
    private admincourseService: AdminCourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit() {
  this.breadcrumbItems = [];
  this.breadcrumbItems.push({ label: 'Admin'});
  this.breadcrumbItems.push({ label: 'จัดการ Course', styleClass: 'custom-admin'});

  this.fetchCourses();
  }

  fetchCourses() {
    this.loading = true;
    this.courseService.getCourses().subscribe(
      (data: Course[]) => {
        this.course = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching courses:', error);
        this.loading = false;
      }
    );
  }
  
  showDialog() {
    this.resetForm();
    this.display = true; 
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  truncateText(text: string, limit: number): string {
    return text?.length > limit ? text.slice(0, limit) + "..." : text;
  }

  // แปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD
  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }
  
  // แปลงเวลาให้เป็นรูปแบบ HH:mm
  formatTime(time: Date): string {
    if (!time) return '';
    const date = new Date(time);
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  saveCourse() {
    const model = {
      courseName: this.courseName,
      subtitle: this.subtitle,
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate),
      startTime: this.formatTime(this.startTime),
      endTime: this.formatTime(this.endTime),
      description: this.description,
    };
  
    this.admincourseService.addCourse(model).subscribe(
      () => {
        this.display = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'เพิ่มสำเร็จ',
          detail: 'คุณได้ทำการเพิ่ม Course แล้ว',
        });
        this.fetchCourses();
      }
    );
  }
  
  resetForm() {
    this.courseName = '';
    this.subtitle = '';
    this.startDate = null!;
    this.endDate = null!;
    this.startTime = null!;
    this.endTime = null!;
    this.description = '';
  }
  
  onDeleteCourse(courseId: string) {
      this.admincourseService.deleteCourse(courseId).subscribe(
        () => {
          this.fetchCourses(); 
        }
      );
  }

  showDeleteViaToast(courseId: string) {
    this.admincourseService.deleteCourse(courseId).subscribe(() => {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'ลบสำเร็จ',
        detail: 'คุณได้ทำการลบ Course แล้ว'
      });
      this.fetchCourses();
    });
  }
  
  confirmDeleteViaToast(event: Event, courseId: string) {
    this.confirmationService.confirm({
      key: 'confirmCanCelViaToast',
      target: event.target || new EventTarget(),
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบ Course นี้?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.showDeleteViaToast(courseId);
      },
    });
  }
}
  
