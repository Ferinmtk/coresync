document.addEventListener("DOMContentLoaded", async () => {
    const tenantTable = document.querySelector("#tenantTable tbody"); // Table body for tenants
    const loader = document.querySelector("#loader"); // Loader element
    const createTenantForm = document.querySelector("#createTenantForm"); // Tenant creation form

    // Show loader on page load
    if (loader) loader.style.display = "block";

    try {
        // Fetch existing tenants
        const tenants = await fetchTenants();

        // Populate table
        if (tenants && tenants.length > 0) {
            populateTenantTable(tenantTable, tenants);
        } else {
            showToast("No tenants found.", "info");
        }
    } catch (error) {
        console.error(error);
        showToast(`Error loading tenants: ${error.message}`, "error");
    } finally {
        if (loader) loader.style.display = "none";
    }

    // Handle tenant creation
    createTenantForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent form submission

        const tenantName = document.querySelector("#tenantName").value;
        const tenantSchema = document.querySelector("#tenantSchema").value;

        try {
            const newTenant = await createTenant({ name: tenantName, schema_name: tenantSchema });
            addTenantToTable(tenantTable, newTenant); // Add new tenant to the table
            showToast("Tenant created successfully.", "success");
            createTenantForm.reset(); // Clear form
        } catch (error) {
            console.error(error);
            showToast(`Error creating tenant: ${error.message}`, "error");
        }
    });
});

// Function to fetch all tenants
async function fetchTenants() {
    const response = await fetch("/api/tenants", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tenants. ${errorText}`);
    }

    return await response.json();
}

// Function to create a new tenant
async function createTenant(tenantData) {
    const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(tenantData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create tenant. ${errorText}`);
    }

    return await response.json();
}

// Function to delete a tenant
async function deleteTenant(id) {
    if (!confirm("Are you sure you want to delete this tenant?")) return;

    try {
        const response = await fetch(`/api/tenants/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete tenant. ${errorText}`);
        }

        // Remove tenant from the table
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();

        showToast("Tenant deleted successfully.", "success");
    } catch (error) {
        console.error(error);
        showToast(`Error deleting tenant: ${error.message}`, "error");
    }
}

// Function to populate the tenant table
function populateTenantTable(tableBody, tenants) {
    tenants.forEach(tenant => addTenantToTable(tableBody, tenant));
}

// Function to add a single tenant to the table
function addTenantToTable(tableBody, tenant) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", tenant.id);
    row.innerHTML = `
        <td>${tenant.name}</td>
        <td>${tenant.schema_name}</td>
        <td>
            <button onclick="deleteTenant('${tenant.id}')" aria-label="Delete Tenant">🗑 Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}

// Utility function for toast notifications
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`; // Type: 'success', 'error', or 'info'
    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto-remove toast after 3 seconds
    setTimeout(() => toast.remove(), 3000);
}
