document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/analytics/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const data = await response.json();

    const ordersChart = new Chart(document.getElementById("ordersChart"), {
        type: "bar",
        data: {
            labels: ["Total Orders"],
            datasets: [{
                label: "Orders",
                data: [data.total_orders],
                backgroundColor: "blue"
            }]
        }
    });

    const revenueChart = new Chart(document.getElementById("revenueChart"), {
        type: "line",
        data: {
            labels: ["Total Revenue"],
            datasets: [{
                label: "Revenue ($)",
                data: [data.revenue],
                borderColor: "green",
                fill: false
            }]
        }
    });
});
