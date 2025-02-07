export type RegistrationFormData = {
    name: string;
    nickname?: string;
    birthdate?: Date;
    gender?: string;
    contact_number?: string;
    payment?: number;
    tshirt_paid?: boolean | null;
    extra?: number;
    dp_amount?: number;
    fp_amount?: number;
    dp_date?: Date | null;
    fp_date?: Date | null;
    sponsor_amount?: number;
    remarks?: string;
    user_id?: string;
}
