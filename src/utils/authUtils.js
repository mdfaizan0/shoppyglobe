export async function getProfile(token) {
    if (!token) return null;

    try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
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