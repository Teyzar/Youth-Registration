import RegistrationFormData from "@/types/register.types";

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

export async function updateCamper(id: string, data: RegistrationFormData) {
    const response = await fetch(`/api/campers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    const camper = await response.json();
    return camper;
}
