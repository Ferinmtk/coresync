document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/pages/login.html";
        return;
    }

    try {
        const response = await fetch("/api/billing/subscription", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        document.getElementById("currentPlan").textContent = data.plan || "None";

    } catch (error) {
        console.error("Error fetching subscription:", error);
    }
});

// Handle Subscription Buttons
document.querySelectorAll(".subscribe-btn").forEach(button => {
    button.addEventListener("click", async (event) => {
        const plan = event.target.getAttribute("data-plan");
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("/api/billing/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ plan }),
            });

            const data = await response.json();
            alert(data.message);
            location.reload();
        } catch (error) {
            console.error("Subscription error:", error);
        }
    });
});

// Handle Subscription Cancellation
document.getElementById("cancelSubscription").addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("/api/billing/cancel", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        alert(data.message);
        location.reload();
    } catch (error) {
        console.error("Cancellation error:", error);
    }
});
