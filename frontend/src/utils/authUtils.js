import { ENDPOINTS } from "./config";

export async function getProfile(token) {
    if (!token) return null;

    try {
        const res = await fetch(ENDPOINTS.USER_PROFILE, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.status === 401 || res.status === 403) {
            return { expired: true };
        }

        return { user: data.user };
    } catch (error) {
        console.log("Error fetching profile:", error.message);
        return null;
    }
}