import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { AdminChapter, AdminChapterContent } from 'src/app/shared/models/admincourse.model';
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
  chapters: AdminChapter[] = [];
  contents: AdminChapterContent[] = [];

  expandedRows = {};
  breadcrumbItems: MenuItem[] = [];

  //chapter
  selectedChapterId: string = '';
  chapterTitle: string = '';
  
  //content
  selectedContentId: string = '';
  contentTitle: string = '';
  body: string = '';

  loading: boolean = true;
  display: boolean = false;
  editMode: boolean = false;
  displayContent: boolean = false;

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
    // this.expandedRows = {}; 
    this.expandedRows[event.data.chapterId] = true; 
  }
  
  onRowCollapse(event: TableRowCollapseEvent) {
    delete this.expandedRows[event.data.chapterId]; 
  }

  showDialogContent(chapterId: string){
    this.displayContent = true;
    this.selectedChapterId = chapterId;
    this.editMode = false;
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
    const courseId = this.route.snapshot.params['courseId'];      this.courseService.getCourseById(courseId).subscribe({
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
    if (!this.chapterTitle.trim()) {
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
      title: this.chapterTitle,
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
    this.chapterTitle = '';
    this.contentTitle = '';
    this.body = '';
  }

  editChapter(chapter: AdminChapter) {
    this.editMode = true;
    this.selectedChapterId = chapter.chapterId;
    this.chapterTitle = chapter.title;
    this.display = true;
  }
    
  updateChapter() {
    if (!this.chapterTitle.trim()) {
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
      title: this.chapterTitle,
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

  saveContent() {
    if (!this.contentTitle.trim()) {
      this.messageService.add({
        key: 'tst',
        severity: 'warn',
        summary: 'กรอกข้อมูลไม่ครบ',
        detail: 'กรุณาระบุชื่อหัวข้อ',
      });
      return;
    }
  
    const model = {
      chapterId: this.selectedChapterId,
      contentTitle: this.contentTitle,
      body: this.body,
    };
  
    this.admincourseService.addContent(model).subscribe({
      next: () => {
        this.displayContent = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'เพิ่มสำเร็จ',
          detail: 'คุณได้ทำการเพิ่มหัวข้อแล้ว',
        });
        this.fetchChapters();
      },
    });
  
    this.resetForm();
  }

  editContent(content: AdminChapterContent) {
    this.editMode = true;
    this.selectedContentId = content.contentId;
    this.contentTitle = content.contentTitle;
    this.body = content.body;
    this.displayContent = true;
  }
  
  updateContent() {
    if (!this.contentTitle.trim()) {
      this.messageService.add({
        key: 'tst',
        severity: 'warn',
        summary: 'กรอกข้อมูลไม่ครบ',
        detail: 'กรุณาระบุชื่อหัวข้อ',
      });
      return;
    }
  
    const updatedContent = {
      contentId: this.selectedContentId,
      contentTitle: this.contentTitle,
      body: this.body,
    };
  
    this.admincourseService.updateContent(updatedContent).subscribe({
      next: () => {
        this.displayContent = false;
        this.messageService.add({
          key: 'tst',
          severity: 'info',
          summary: 'แก้ไขสำเร็จ',
          detail: 'คุณได้ทำการแก้ไขหัวข้อแล้ว',
        });
        this.fetchChapters();
      }
    });
  
    this.resetForm();
  }
    

  deleteContent(contentId: string) {
    this.admincourseService.deleteContent(contentId).subscribe(() => {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'ลบสำเร็จ',
        detail: 'คุณได้ทำการลบหัวข้อแล้ว',
      });
      this.fetchChapters();
    });
  }  

  confirmDeleteContentViaToast(event: Event, contentId: string) {
    this.confirmationService.confirm({
      key: 'confirmDeleteContentViaToast',
      target: event.target || new EventTarget(),
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบหัวข้อนี้?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteContent(contentId);
      },
    });
  }
}
