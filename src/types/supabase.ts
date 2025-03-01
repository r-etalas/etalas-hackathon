Need to install the following packages:
supabase@2.15.8
Ok to proceed? (y)

export type UserRole = 'admin' | 'member';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
} 