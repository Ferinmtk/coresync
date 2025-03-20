document.addEventListener("DOMContentLoaded", async () => {
    const tenantTable = document.querySelector("#tenantTable tbody");

    // Fetch all tenants and display them in the table
    try {
        const response = await fetch("/api/admin/tenants", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tenants.");
        }

        const tenants = await response.json();

        // Populate the table with tenant data
        tenants.forEach(tenant => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tenant.name}</td>
                <td>${tenant.schema_name}</td>
                <td>
                    <button onclick="deleteTenant('${tenant.id}')">🗑 Delete</button>
                </td>
            `;
            tenantTable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert("Error fetching tenants: " + error.message);
    }
});

// Function to delete a tenant
async function deleteTenant(id) {
    if (!confirm("Are you sure you want to delete this tenant?")) return;

    try {
        const response = await fetch(`/api/admin/tenants/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete tenant.");
        }

        // Reload the page to refresh the tenant list
        alert("Tenant deleted successfully.");
        location.reload();
    } catch (error) {
        console.error(error);
        alert("Error deleting tenant: " + error.message);
    }
}
