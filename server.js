const express = require("express");
const oracledb = require("oracledb");
const path = require("path");

oracledb.initOracleClient({
    libDir: "C:\\Users\\Happy\\Downloads\\instantclient-basic-windows.x64-23.26.3.0.0\\instantclient_23_26"
});

const app = express();
const PORT = 3000;

const dbConfig = {
    user: "SYSTEM",
    password: "system123",
    connectString: "localhost/XE"
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ================= CUSTOMER =================

// Get Customers
app.get("/api/customers", async (req, res) => {
    res.send("Customers API Working");
});


// Add Customer
    let connection;
app.post("/api/customers", async (req, res) => {
    let connection;

    try {
        const { customerId, name, email, country } = req.body;

        connection = await oracledb.getConnection(dbConfig);

        await connection.execute(
            `INSERT INTO CUSTOMERS
             (CUSTOMER_ID, NAME, EMAIL, COUNTRY)
             VALUES (:customerId, :name, :email, :country)`,
            {
                customerId: Number(customerId),
                name: name,
                email: email,
                country: country
            },
            { autoCommit: true }
        );

        res.json({
            success: true,
            message: "Customer added successfully"
        });

    } catch (error) {
        console.error("CUSTOMER ADD ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// ================= PRODUCT =================

// Get Products
app.get("/api/products", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT PRODUCT_ID, NAME, CATEGORY
             FROM PRODUCTS
             ORDER BY PRODUCT_ID`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error("GET PRODUCTS ERROR:", err);

        res.status(500).json({
            message: "Product fetch failed",
            error: err.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// Add Product
app.post("/api/products", async (req, res) => {
    let connection;

    try {
        const { productId, name, category } = req.body;

        if (!productId || !name || !category) {
            return res.status(400).json({
                message: "Please fill all product fields"
            });
        }

        connection = await oracledb.getConnection(dbConfig);

        await connection.execute(
            `INSERT INTO PRODUCTS
             (PRODUCT_ID, NAME, CATEGORY)
             VALUES (:productId, :name, :category)`,
            {
                productId: Number(productId),
                name,
                category
            },
            { autoCommit: true }
        );

        res.json({
            message: "Product added successfully"
        });

    } catch (err) {
        console.error("ADD PRODUCT ERROR:", err);

        res.status(500).json({
            message: "Product add failed",
            error: err.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// ================= FEEDBACK =================

// Get Feedback
app.get("/api/feedback", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT FEEDBACK_ID,
                    CUSTOMER_ID,
                    PRODUCT_ID,
                    FEEDBACK_TEXT,
                    SENTIMENT
             FROM FEEDBACK
             ORDER BY FEEDBACK_ID`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        res.json(result.rows);

    } catch (err) {
        console.error("GET FEEDBACK ERROR:", err);

        res.status(500).json({
            message: "Feedback fetch failed",
            error: err.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// Add Feedback
app.post("/api/feedback", async (req, res) => {
    let connection;

    try {
        const {
            feedbackId,
            customerId,
            productId,
            feedbackText,
            sentiment
        } = req.body;

        if (
            !feedbackId ||
            !customerId ||
            !productId ||
            !feedbackText ||
            !sentiment
        ) {
            return res.status(400).json({
                message: "Please fill all feedback fields"
            });
        }

        connection = await oracledb.getConnection(dbConfig);

        await connection.execute(
            `INSERT INTO FEEDBACK
             (FEEDBACK_ID, CUSTOMER_ID, PRODUCT_ID, FEEDBACK_TEXT, SENTIMENT)
             VALUES
             (:feedbackId, :customerId, :productId, :feedbackText, :sentiment)`,
            {
                feedbackId: Number(feedbackId),
                customerId: Number(customerId),
                productId: Number(productId),
                feedbackText,
                sentiment
            },
            { autoCommit: true }
        );

        res.json({
            message: "Feedback added successfully"
        });

    } catch (err) {
        console.error("ADD FEEDBACK ERROR:", err);

        res.status(500).json({
            message: "Feedback add failed",
            error: err.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// ================= DASHBOARD =================

app.get("/api/dashboard", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const customerResult = await connection.execute(
            'SELECT COUNT(*) AS TOTAL FROM CUSTOMERS'
        );

        const productResult = await connection.execute(
            'SELECT COUNT(*) AS TOTAL FROM PRODUCTS'
        );

        const feedbackResult = await connection.execute(
            'SELECT COUNT(*) AS TOTAL FROM FEEDBACK'
        );

        res.json({
            customers: customerResult.rows[0][0],
            products: productResult.rows[0][0],
            feedback: feedbackResult.rows[0][0]
        });

    } catch (error) {
        console.error("DASHBOARD ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// ================= START SERVER =================

app.listen(PORT, () => {
    console.log("Server running on port 3000");
});