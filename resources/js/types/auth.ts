export type User = {
    id: number;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    dob: string | null;
    gender: string | null;
    street: string | null;
    brgy: string | null;
    municipality: string | null;
    province: string | null;
    postal_code: string | null;
    role: 'super_admin' | 'bjmp_officer' | 'visitor' | 'monitoring_officer';
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
