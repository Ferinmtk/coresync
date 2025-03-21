document.addEventListener("DOMContentLoaded", async () => {
    const tenantTable = document.querySelector("#tenantTable tbody");
    const loader = document.querySelector("#loader"); // Loader element
    loader.style.display = "block"; // Show loader while fetching data

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
            row.setAttribute("data-id", tenant.id); // Add data-id for dynamic row deletion
            row.innerHTML = `
                <td>${tenant.name}</td>
                <td>${tenant.schema_name}</td>
                <td>
                    <button onclick="deleteTenant('${tenant.id}')" aria-label="Delete Tenant">🗑 Delete</button>
                </td>
            `;
            tenantTable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        showToast("Error fetching tenants: " + error.message, "error");
    } finally {
        loader.style.display = "none"; // Hide loader after data is fetched
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

        // Dynamically remove the row from the table without reloading
        document.querySelector(`tr[data-id="${id}"]`).remove();
        showToast("Tenant deleted successfully.", "success");
    } catch (error) {
        console.error(error);
        showToast("Error deleting tenant: " + error.message, "error");
    }
}

// Utility function to show toast notifications
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`; // Type: 'success' or 'error'
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000); // Auto-remove after 3 seconds
}
