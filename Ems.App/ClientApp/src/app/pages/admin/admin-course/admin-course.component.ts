import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AdminCourse } from 'src/app/shared/models/admincourse.model';
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
  courses: AdminCourse [] = [];
  minSelectableDate: Date = new Date();


  additionalDescription: string = '';
  selectedCourseId: string = '';

  courseName: string = '';
  subtitle: string = '';
  startDate!: Date;
  endDate!: Date;
  startTime!: Date;
  endTime!: Date;
  description: string = '';

  editMode: boolean = false;
  loading: boolean = true;
  display: boolean = false;

  courseNameDirty: boolean = false;
  subtitleDirty: boolean = false;
  startDateDirty: boolean = false;
  endDateDirty: boolean = false;
  startTimeDirty: boolean = false;
  endTimeDirty: boolean = false;


  @ViewChild('filter') filter!: ElementRef;

  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    fonts: [
      {class: 'arial', name: 'Arial'},
    ],
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(
    private courseService: CourseService,
    private admincourseService: AdminCourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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
    this.editMode = false;
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

  // แปลงจาก Date เป็น yyyy-MM-dd สำหรับบันทึก
  formatDateForSave(date: Date): string {
    if (!date) return '';
    const newDate = new Date(date);
    newDate.setHours(12, 0, 0, 0);
    return newDate.toISOString().split('T')[0];
  }

  // แปลงจาก yyyy-MM-dd เป็น dd/MM/yyyy สำหรับแสดงผล
  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  formatTime(time: string | Date): string {
    if (!time) return '';
    if (typeof time === 'string') {
        return time.slice(0, 5);
    }
    const date = new Date(time);
    return date.toTimeString().slice(0, 5);
  }

  updateDirtyFields() {
    if (this.courseName) this.courseNameDirty = false;
    if (this.subtitle) this.subtitleDirty = false;
    if (this.startDate) this.startDateDirty = false;
    if (this.endDate) this.endDateDirty = false;
    if (this.startTime) this.startTimeDirty = false;
    if (this.endTime) this.endTimeDirty = false;
  }

  validateForm(): boolean {
    this.courseNameDirty = true;
    this.subtitleDirty = true;
    this.startDateDirty = true;
    this.endDateDirty = true;
    this.startTimeDirty = true;
    this.endTimeDirty = true;

    this.updateDirtyFields();

    return !!this.courseName && !!this.subtitle && !!this.startDate && !!this.endDate && !!this.startTime && !!this.endTime;
  }

  saveCourse() {
    if (!this.validateForm()) {
      return;
    }
    this.updateDirtyFields();
    const model = {
      courseName: this.courseName,
      subtitle: this.subtitle,
      startDate: this.formatDateForSave(this.startDate),
      endDate: this.formatDateForSave(this.endDate),
      startTime: this.formatTime(this.startTime),
      endTime: this.formatTime(this.endTime),
      description: this.description,
    };

    this.admincourseService.addCourse(model).subscribe(() => {
      this.display = false;
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'เพิ่มสำเร็จ',
        detail: 'คุณได้ทำการเพิ่ม Course แล้ว',
      });
      this.fetchCourses();
    });
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

  editCourse(course: AdminCourse) {
    this.editMode = true;
    this.selectedCourseId = course.courseId;

    this.courseName = course.courseName;
    this.subtitle = course.subtitle;
    this.startDate = new Date(course.startDate);
    this.startDate.setHours(12, 0, 0, 0);

    this.endDate = new Date(course.endDate);
    this.endDate.setHours(12, 0, 0, 0);

    this.startTime = new Date(`1970-01-01T${course.startTime}`);
    this.endTime = new Date(`1970-01-01T${course.endTime}`);

    this.description = course.description;
    this.display = true;
    this.resetDirtyFlags();
  }

  resetDirtyFlags() {
    this.courseNameDirty = false;
    this.subtitleDirty = false;
    this.startDateDirty = false;
    this.endDateDirty = false;
    this.startTimeDirty = false;
    this.endTimeDirty = false;
  }

  updateCourse() {
    const updatedCourse = {
      courseId: this.selectedCourseId,
      courseName: this.courseName,
      subtitle: this.subtitle,
      startDate: this.formatDateForSave(this.startDate),
      endDate: this.formatDateForSave(this.endDate),
      startTime: this.formatTime(this.startTime),
      endTime: this.formatTime(this.endTime),
      description: this.description,
    };

    this.admincourseService.updateCourse(updatedCourse).subscribe(() => {
      this.display = false;
      this.messageService.add({
        key: 'tst',
        severity: 'info',
        summary: 'แก้ไขสำเร็จ',
        detail: 'คุณได้ทำการแก้ไข Course แล้ว',
      });
      this.fetchCourses();
    });
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
        severity: 'success',
        summary: 'ลบสำเร็จ',
        detail: 'คุณได้ทำการลบ Course แล้ว'
      });
      this.fetchCourses();
    });
  }

  confirmDeleteViaToast(event: Event, courseId: string) {
    this.confirmationService.confirm({
      key: 'confirmDeleteViaToast',
      target: event.target || new EventTarget(),
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบ Course นี้?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.showDeleteViaToast(courseId);
      },
    });
  }
}

