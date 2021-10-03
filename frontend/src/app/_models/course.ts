export class Course {
    _id?: string;
    course_name?: string;
    course_degree?: string;
    course_language?: string;
    course_year?: string;
    course_start_date?: string;
    course_end_date?: string;
    course_description?: string;
    course_resources?: [{
        createdAt?: Date,
        name?: string;
    }];
}