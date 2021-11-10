export class User {
    _id?: string;
    user_username?: string;
    user_password?: string;
    user_name?: string;
    user_lastname?: string;
    user_gender?: string;
    user_role?: string;
    user_birthDate?: string;
    user_avatar?: string;
    user_registrationDate?: string;
    user_courses?: string[];
    user_profile?: {
        user_education?: string;
        user_languages?: string[];
        user_degree?: string;
        user_future_degree?: string;
        user_passions?: string[];
        user_goal?: string;
        user_disabilities?: {
            name?: string;
            level?: number;
        }[];
    };
    token?: string;
}