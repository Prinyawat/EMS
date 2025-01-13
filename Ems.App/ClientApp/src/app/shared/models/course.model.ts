export interface Course {
    courseId: string;            // ตรงกับ CourseId ใน C#
    courseName: string;          // ตรงกับ CourseName
    subtitle: string;            // ตรงกับ Subtitle
    description: string;         // ตรงกับ Description
    startDate: Date;             // ใช้ Date ใน TypeScript ตรงกับ DateOnly
    endDate: Date;               // ใช้ Date สำหรับ EndDate
    startTime: string;           // TimeOnly ควรใช้ string หรือเวลาที่จัดรูปแบบแล้ว
    endTime: string;             // TimeOnly ควรเป็น string หรือเวลาที่จัดรูปแบบแล้ว
    createdBy: string;
    createdDate?: Date;
    updatedBy: string;
    updatedDate?: Date;
    status: string;              // เพิ่มฟิลด์ Status ถ้าใช้สถานะในการลงทะเบียน
    display?: boolean;           // สำหรับการเปิด/ปิด Dialog
  }
  