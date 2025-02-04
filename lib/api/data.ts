import { RegistrationFormData, TableData } from "@/types";

export async function getCampers() {
    const response = await fetch('/api/campers');
    const campers = await response.json();
    return campers;
}

export async function deleteCampers(ids: string[]) {
    const response = await fetch(`/api/campers/${ids}`, {
        method: 'DELETE',
    });
    const camper = await response.json();
    return camper;
}

export async function updateCamper(id: string, data: TableData) {
    const response = await fetch(`/api/campers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    const camper = await response.json();
    return camper;
}

export async function registerCamper(formData: RegistrationFormData, method: 'POST' | 'PUT', queryParams?: string) {
    const response = await fetch(`/api/registration${queryParams ? `?${queryParams}` : ''}`, {
        method: method,
        body: JSON.stringify(formData),
    });

    return await response.json();
}
