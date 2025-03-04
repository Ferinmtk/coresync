const API_URL = "http://localhost:5000/api";

async function fetchSubscriptionStatus() {
    const token = localStorage.getItem("authToken"); // Get user token

    const response = await fetch(`${API_URL}/subscriptions/status`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    document.getElementById("current-plan").innerHTML = `Current Plan: <strong>${data.plan || "None"}</strong>`;

    if (data.plan && data.plan !== "Free") {
        document.getElementById("cancel-btn").style.display = "block";
    }
}

async function subscribe(plan) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/subscriptions/checkout`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
    });

    const data = await response.json();

    if (data.sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
    } else {
        alert("Error processing subscription.");
    }
}

async function cancelSubscription() {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_URL}/subscriptions/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (data.success) {
        alert("Subscription canceled.");
        location.reload();
    } else {
        alert("Failed to cancel.");
    }
}

document.addEventListener("DOMContentLoaded", fetchSubscriptionStatus);
