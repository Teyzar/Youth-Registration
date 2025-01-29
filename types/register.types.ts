export default interface RegistrationFormData {
    name: string;
    nickname?: string;
    birthdate?: string;
    gender?: string;
    contact_number?: string;
    payment?: number;
    tshirt_paid?: boolean | null;
    extra?: number;
    dp_amount?: number;
    fp_amount?: number;
    dp_date?: Date;
    fp_date?: Date;
    sponsor_amount?: number;
    remarks?: string;
}
