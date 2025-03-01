export type UserRole = 'admin' | 'member';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
} 