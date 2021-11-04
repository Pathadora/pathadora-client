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
        user_language?: string;
        user_degree?: string;
        user_future_degree?: string;
        user_passion?: string;
        user_learning_style?: {
            active_reflective?: string;
            sensing_intuitive?: string;
            visual_veral?: string;
            sequential_global?: string;
          },
        user_goal?: string;
        user_disability?: string;
    };
    token?: string;
}