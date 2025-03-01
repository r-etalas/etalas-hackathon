export type UserRole = 'admin' | 'member';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

export interface Database {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<User, 'id'>>;
            };
            // Tambahkan tabel lain sesuai kebutuhan
        };
    };
} 