import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { AdminChapter } from 'src/app/shared/models/admincourse.model';
import { AdminCourseService } from 'src/app/shared/services/admincourse.service';
import { CourseService } from 'src/app/shared/services/course.service';

@Component({
  selector: 'app-chapter-content',
  templateUrl: './admin-chapter.component.html',
  styleUrls: ['./admin-chapter.component.scss'],
  providers: [MessageService]
})
export class AdminChapterComponent implements OnInit {
  
  course: any;
  chapters: any;
  contents: any;

  expandedRows = {};
  breadcrumbItems: MenuItem[] = [];

  selectedChapterId: string = '';
  courseName: string = '';

  loading: boolean = true;
  display: boolean = false;
  editMode: boolean = false;

  @ViewChild('filter') filter!: ElementRef;
  
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private admincourseService: AdminCourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
  this.fetchChapters();
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.expandedRows = {}; 
    this.expandedRows[event.data.chapterId] = true; 
  }
  
  onRowCollapse(event: TableRowCollapseEvent) {
    delete this.expandedRows[event.data.chapterId]; 
  }

  showDialog() {
    this.display = true; 
    this.editMode = false;
    this.resetForm();
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

    fetchChapters() {
      this.loading = true;
      const courseId = this.route.snapshot.params['courseId'];
      this.courseService.getCourseById(courseId).subscribe({
        next: (course) => {
          this.course = course;
          this.chapters = this.course?.chapters.map((chapter: any) => ({
            ...chapter,
            contents: chapter.contents || [],
          }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
    
    saveChapter() {
      if (!this.courseName.trim()) {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'กรอกข้อมูลไม่ครบ',
          detail: 'กรุณาระบุชื่อบทเรียน',
        });
        return;
      }
    
      const model = {
        courseId: this.course.courseId,
        title: this.courseName,
      };
    
      this.admincourseService.addchapter(model).subscribe({
        next: () => {
          this.display = false;
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'เพิ่มสำเร็จ',
            detail: 'คุณได้ทำการเพิ่มบทเรียนแล้ว',
          });
          this.fetchChapters(); 
        }
      });
      this.resetForm();
    }

    resetForm() {
      this.courseName = '';
    }

    editChapter(chapter: AdminChapter) {
      this.editMode = true;
      this.selectedChapterId = chapter.chapterId;
      this.courseName = chapter.title;
      this.display = true;
    }
    
    updateChapter() {
      if (!this.courseName.trim()) {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'กรอกข้อมูลไม่ครบ',
          detail: 'กรุณาระบุชื่อบทเรียน',
        });
        return;
      }
    
      const updatedChapter = {
        chapterId: this.selectedChapterId,
        title: this.courseName,
      };
    
      this.admincourseService.updateChapter(updatedChapter).subscribe({
        next: () => {
          this.display = false;
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'แก้ไขสำเร็จ',
            detail: 'คุณได้ทำการแก้ไขบทเรียนแล้ว',
          });
          this.fetchChapters(); 
        }
      });
      this.resetForm();
    }
    

    onDeleteChapter(chapterId: string) {
      this.admincourseService.deleteChapter(chapterId).subscribe(() =>{

      });
    }

    showDeleteViaToast(chapterId: string) {
      this.admincourseService.deleteChapter(chapterId).subscribe(() =>{
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'ลบสำเร็จ',
          detail: 'คุณได้ทำการลบบทเรียนแล้ว'
        });
        this.fetchChapters();
      });
    }

    confirmDeleteViaToast(event: Event, chapterId: string) {
      this.confirmationService.confirm({
        key: 'confirmDeleteViaToast',
        target: event.target || new EventTarget(),
        message: 'คุณแน่ใจหรือไม่ว่าต้องการลบ บทเรียน นี้?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.showDeleteViaToast(chapterId);
        },
      });
    }

}
