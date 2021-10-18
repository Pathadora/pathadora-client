export class Course {
    _id?: string;
    course_name?: string;
    course_degree?: string;
    course_faculty?: string;
    course_language?: string;
    course_period?: string;
    course_cfu?: number;
    course_year?: string;
    course_type?: string;
    course_scientific_area?: string;
    course_mandatory?: boolean;
    course_start_date?: string;
    course_end_date?: string;
    course_description?: string;
    course_resources?: [{
        createdAt?: Date,
        name?: string,
        metadata?: {};
    }];
}