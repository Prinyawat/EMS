import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { AdminChapter, AdminChapterContent, AdminOption, AdminQuestion } from 'src/app/shared/models/admincourse.model';
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
    questions: AdminQuestion[] = [];
    option: AdminOption[] = [];

    expandedRows = {};
    breadcrumbItems: MenuItem[] = [];

    //chapter
    selectedChapterId: string = '';
    selectedChapterTitle: string = '';
    chapterTitle: string = '';

    //content
    selectedContentId: string = '';
    contentTitle: string = '';
    body: string = '';

    //question
    selectedQuestionId: string = '';
    selectedQuestionText: string= '';
    questionText: string = '';

    //option
    selectedOptionId: string = '';
    optionText: string = '';
    isCorrect: boolean;
    options: { optionText: string; isCorrect: boolean }[] = [];

    chapterTitleDirty: boolean = false;
    contentTitleDirty: boolean = false;
    bodyDirty: boolean = false;
    questionTextDirty: boolean = false;
    optionTextDirty: boolean = false;

    loading: boolean = true;
    display: boolean = false;
    editMode: boolean = false;
    displayContent: boolean = false;
    displayQuestion: boolean = false;
    displayOption: boolean = false;
    isLessonView: boolean = true;

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
      { class: 'arial', name: 'Arial' },
    ],
    toolbarHiddenButtons: [],
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
    private route: ActivatedRoute,
    private courseService: CourseService,
    private admincourseService: AdminCourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

    ngOnInit(): void {
        this.fetchChapters();
    }

    onRowExpand(event: TableRowExpandEvent) {
        // this.expandedRows = {};
        this.expandedRows[event.data.chapterId] = true;
        this.expandedRows[event.data.questionId] = true;
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        delete this.expandedRows[event.data.chapterId];
        delete this.expandedRows[event.data.questionId];
    }

    showDialogContent(chapterId: string, chapterTitle: string) {
        this.displayContent = true;
        this.selectedChapterId = chapterId;
        this.selectedChapterTitle = chapterTitle;
        this.editMode = false;
        this.resetForm();
    }

    showDialog() {
        this.display = true;
        this.editMode = false;
        this.resetForm();
    }

    showDialogQuestion() {
        this.displayQuestion = true;
        this.editMode = false;
        this.resetForm();
    }

    showDialogOption(questionId: string, questionText: string) {
        this.displayOption = true;
        this.selectedQuestionId = questionId;
        this.selectedQuestionText = questionText;
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
                this.chapters = this.course?.chapters || [];
                this.chapters.forEach((chapter) => {
                    chapter.contents = chapter.contents || [];
                });

                this.questions = this.course?.questions || [];
                this.questions.forEach((question) => {
                    question.options = question.options || [];
                });

                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    updateDirtyFields() {
      if (this.chapterTitle) this.chapterTitleDirty = false;
      if (this.contentTitle) this.contentTitleDirty = false;
      if (this.body) this.bodyDirty = false;
      if (this.questionText) this.questionTextDirty = false;


    }
  
    validateChapterForm(): boolean {
      this.chapterTitleDirty = true;

      this.updateDirtyFields();
  
      return !!this.chapterTitle 
    }

    validateContentForm(): boolean {
      this.contentTitleDirty = true;
      this.bodyDirty = true;

      this.updateDirtyFields();
  
      return !!this.contentTitle && !!this.body 
    }

    validateQuestionForm(): boolean {
      this.questionTextDirty = true;

      this.updateDirtyFields();
  
      return !!this.questionText
    }

    resetDirtyFlags() {
      this.chapterTitleDirty = false;
      this.contentTitleDirty = false;
      this.bodyDirty = false;
      this.questionTextDirty = false;
    }

    resetForm() {
        this.chapterTitle = '';
        this.contentTitle = '';
        this.body = '';

        // question & option
        this.questionText = '';
        this.options = [{ optionText: '', isCorrect: false }];

        this.resetDirtyFlags();
    }

    saveChapter() {
      if (!this.validateChapterForm()) {
        return;
      }
      this.updateDirtyFields();

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

    editChapter(chapter: AdminChapter) {
        this.editMode = true;
        this.selectedChapterId = chapter.chapterId;
        this.chapterTitle = chapter.title;
        this.display = true;
        this.resetDirtyFlags()
    }

    updateChapter() {
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
        this.admincourseService.deleteChapter(chapterId).subscribe(() => {
        });
    }

    showDeleteViaToast(chapterId: string) {
        this.admincourseService.deleteChapter(chapterId).subscribe(() => {
            this.messageService.add({
                key: 'tst',
                severity: 'success',
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
        if (!this.validateContentForm()) {
          return;
        }
        this.updateDirtyFields();

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
        this.resetDirtyFlags()
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
                severity: 'success',
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

    saveQuestion() {
        if (!this.validateQuestionForm()) {
          return;
        }
        this.updateDirtyFields();

        const model = {
            courseId: this.course.courseId,
            questionText: this.questionText,
        };

        this.admincourseService.addQuestion(model).subscribe({
            next: () => {
                this.displayQuestion = false;
                this.messageService.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'เพิ่มสำเร็จ',
                    detail: 'คุณได้ทำการเพิ่มคำถามแล้ว',
                });
                this.fetchChapters();
            }
        });
        this.resetForm();
    }

    editQuestion(question: AdminQuestion) {
        this.editMode = true;
        this.selectedQuestionId = question.questionId;
        this.questionText = question.questionText;
        this.displayQuestion = true;
        this.resetDirtyFlags()
    }

    updateQuestion() {
        if (!this.questionText.trim()) {
            this.messageService.add({
                key: 'tst',
                severity: 'warn',
                summary: 'กรอกข้อมูลไม่ครบ',
                detail: 'กรุณาระบุคำถาม',
            });
            return;
        }

        const updateQuestion = {
            questionId: this.selectedQuestionId,
            questionText: this.questionText,
        };

        this.admincourseService.updateQuestion(updateQuestion).subscribe({
            next: () => {
                this.displayQuestion = false;
                this.messageService.add({
                    key: 'tst',
                    severity: 'info',
                    summary: 'แก้ไขสำเร็จ',
                    detail: 'คุณได้ทำการแก้ไขคำถามแล้ว',
                });
                this.fetchChapters();
            }
        });
        this.resetForm();
    }

    deleteQuestion(questionId: string) {
        this.admincourseService.deleteQuestion(questionId).subscribe(() => {
            this.messageService.add({
                key: 'tst',
                severity: 'success',
                summary: 'ลบสำเร็จ',
                detail: 'คุณได้ทำการลบคำถามแล้ว',
            });
            this.fetchChapters();
        });
    }

    confirmDeleteQuestionViaToast(event: Event, questionId: string) {
        this.confirmationService.confirm({
            key: 'confirmDeleteQuestionViaToast',
            target: event.target || new EventTarget(),
            message: 'คุณแน่ใจหรือไม่ว่าต้องการลบคำถามนี้?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteQuestion(questionId);
            },
        });
    }

    removeOptionField(index: number) {
        this.options.splice(index, 1);
    }

    addOptionField() {
        if (this.options.length < 5) {
            this.options.push({ optionText: '', isCorrect: false });
        }
    }

    saveOption() {
        if (this.options.some((opt) => !opt.optionText.trim())) {
            this.messageService.add({
                key: 'tst',
                severity: 'warn',
                summary: 'กรอกข้อมูลไม่ครบ',
                detail: 'กรุณากรอกคำตอบให้ครบทุกข้อ',
            });
            return;
        }

        this.options.forEach((option) => {
            const model = {
                questionId: this.selectedQuestionId,
                optionText: option.optionText.trim(),
                isCorrect: option.isCorrect,
            };

            this.admincourseService.addOption(model).subscribe({
                next: () => {
                    this.displayOption = false;
                    this.messageService.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'เพิ่มคำตอบสำเร็จ',
                        detail: 'คุณได้ทำการเพิ่มคำตอบแล้ว',
                    });
                    this.fetchChapters();
                },
                error: (err) => {
                    console.error('POST Error:', err);
                    this.messageService.add({
                        key: 'tst',
                        severity: 'error',
                        summary: 'เกิดข้อผิดพลาด',
                        detail: 'ไม่สามารถบันทึกคำตอบได้',
                    });
                },
            });
        });

        this.resetForm();
    }

    editOption(option: AdminOption) {
        this.editMode = true;
        this.selectedOptionId = option.optionId;
        this.options = [{ optionText: option.optionText, isCorrect: option.isCorrect }];
        this.displayOption = true;
    }

    updateOption() {
        if (!this.options[0].optionText.trim()) {
            this.messageService.add({
                key: 'tst',
                severity: 'warn',
                summary: 'กรอกข้อมูลไม่ครบ',
                detail: 'กรุณาระบุชื่อคำตอบ',
            });
            return;
        }

        const updateOption = {
            optionId: this.selectedOptionId,
            optionText: this.options[0].optionText.trim(),
            isCorrect: this.options[0].isCorrect,
        };

        this.admincourseService.updateOption(updateOption).subscribe({
            next: () => {
                this.displayOption = false;
                this.messageService.add({
                    key: 'tst',
                    severity: 'info',
                    summary: 'แก้ไขสำเร็จ',
                    detail: 'คุณได้ทำการแก้ไขคำตอบแล้ว',
                });
                this.fetchChapters();
            }
        });

        this.resetForm();
    }

    deleteOption(optionId: string) {
        this.admincourseService.deleteOption(optionId).subscribe(() => {
            this.messageService.add({
                key: 'tst',
                severity: 'success',
                summary: 'ลบสำเร็จ',
                detail: 'คุณได้ทำการลบคำตอบแล้ว',
            });
            this.fetchChapters();
        });
    }

    confirmDeleteOptionViaToast(event: Event, optionId: string) {
        this.confirmationService.confirm({
            key: 'confirmDeleteOptionViaToast',
            target: event.target || new EventTarget(),
            message: 'คุณแน่ใจหรือไม่ว่าต้องการลบคำตอบนี้?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteOption(optionId);
            },
        });
    }
}
