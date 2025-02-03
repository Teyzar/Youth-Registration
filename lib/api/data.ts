export async function getCampers() {
    const response = await fetch('/api/campers');
    const campers = await response.json();
    return campers;
}

export async function deleteCamper(id: string) {
    const response = await fetch(`/api/campers/${id}`, {
        method: 'DELETE',
    });
    const camper = await response.json();
    return camper;
}
