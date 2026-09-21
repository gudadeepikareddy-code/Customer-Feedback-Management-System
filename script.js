// ====================================================
//              LOAD DASHBOARD
// ====================================================

async function loadDashboard() {
    try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        document.getElementById("customerCount").innerText = data.customers || 0;
        document.getElementById("productCount").innerText = data.products || 0;
        document.getElementById("feedbackCount").innerText = data.feedback || 0;

    } catch (error) {
        console.error("Dashboard Error:", error);

        document.getElementById("customerCount").innerText = 0;
        document.getElementById("productCount").innerText = 0;
        document.getElementById("feedbackCount").innerText = 0;
    }
}

window.onload = function () {
    loadDashboard();
};

// ====================================================
//              ADD CUSTOMER
// ====================================================

async function addCustomer() {

    const customerId =
        document.getElementById("customerId").value;

    const name =
        document.getElementById("customerName").value;

    const email =
        document.getElementById("customerEmail").value;

    const country =
        document.getElementById("country").value;

    if (!customerId || !name || !email || !country) {
        alert("Please fill all customer details");
        return;
    }

    try {

        const response = await fetch("/api/customers", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                customerId: customerId,
                name: name,
                email: email,
                country: country
            })
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            document.getElementById("customerId").value = "";
            document.getElementById("customerName").value = "";
            document.getElementById("customerEmail").value = "";
            document.getElementById("country").value = "";

            loadDashboard();
        }

    } catch (error) {

        console.error("Customer Error:", error);
        alert("Customer add failed");
    }
}

// ====================================================
//              ADD PRODUCT
// ====================================================

async function addProduct() {

    const productId =
        document.getElementById("productId").value;

    const productName =
        document.getElementById("productName").value;

    const category =
        document.getElementById("category").value;

    if (!productId || !productName || !category) {
        alert("Please fill all product details");
        return;
    }

    try {

        const response = await fetch("/api/products", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                productId: productId,
                name: productName,
                category: category
            })
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            document.getElementById("productId").value = "";
            document.getElementById("productName").value = "";
            document.getElementById("category").value = "";

            loadDashboard();
        }

    } catch (error) {

        console.error("Product Error:", error);
        alert("Product add failed");
    }
}

// ====================================================
//              SUBMIT FEEDBACK
// ====================================================

async function submitFeedback() {

    const feedbackId =
        document.getElementById("feedbackId").value;

    const customerId =
        document.getElementById("feedbackCustomerId").value;

    const productId =
     document.getElementById("feedbackProductId").value;

    const feedbackText =
        document.getElementById("feedbackText").value;

    const sentiment =
        document.getElementById("sentiment").value;

    if (
        !feedbackId ||
        !customerId ||
        !productId ||
        !feedbackText ||
        !sentiment
    ) {
        alert("Please fill all feedback details");
        return;
    }

    try {

        const response = await fetch("/api/feedback", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                feedbackId: feedbackId,
                customerId: customerId,
                productId: productId,
                feedbackText: feedbackText,
                sentiment: sentiment
            })
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            document.getElementById("feedbackId").value = "";
            document.getElementById("feedbackCustomerId").value = "";
            document.getElementById("feedbackProductId").value = "";
            document.getElementById("feedbackText").value = "";

            loadDashboard();
            loadFeedback();
        }

    } catch (error) {

        console.error("Feedback Error:", error);
        alert("Feedback add failed");
    }
}

// ====================================================
//              LOAD FEEDBACK
// ====================================================

async function loadFeedback() {

    try {

        const response = await fetch("/api/feedback");
        const data = await response.json();
        console.log(data);

        const table =
            document.getElementById("feedbackTable");

        if (!table) return;

        table.innerHTML = "";

        data.forEach(item => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.CUSTOMER_ID}</td>
                <td>${item.PRODUCT_ID}</td>
                <td>${item.FEEDBACK_TEXT}</td>
                <td>${item.SENTIMENT}</td>
            `;

            table.appendChild(row);
        });

    } catch (error) {

        console.error("Feedback Load Error:", error);
    }
}

// ====================================================
//              SEARCH FEEDBACK
// ====================================================

function searchFeedback() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const searchValue =
        input.value.toLowerCase();

    const rows =
        document.querySelectorAll("#feedbackTable tr");

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        if (text.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// ====================================================
//              PAGE LOAD
// ====================================================

window.onload = function () {

    loadDashboard();
    loadFeedback();

};