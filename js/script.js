// ============================================================
// SMART FOOD WASTE MANAGEMENT SYSTEM
// Main JavaScript File
// ============================================================


// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBobsVbRVHTwk7msxkCVqSEBW3VF__E__o",
    authDomain: "smart-food-waste-mngmt-2026.firebaseapp.com",
    databaseURL: "https://smart-food-waste-mngmt-2026-default-rtdb.firebaseio.com",
    projectId: "smart-food-waste-mngmt-2026",
    storageBucket: "smart-food-waste-mngmt-2026.firebasestorage.app",
    messagingSenderId: "901436371265",
    appId: "1:901436371265:web:b3860779c7d75e43d5b1c0",
    measurementId: "G-8L4WFDV799"
};


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

let firebaseApp = null;
let firebaseDB = null;

async function initializeFirebase() {
    if (firebaseDB) {
        return firebaseDB;
    }

    try {
        const { initializeApp } = await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
        );

        const { getDatabase, ref, set, push, get, update } = await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
        );

        firebaseApp = initializeApp(firebaseConfig);
        firebaseDB = getDatabase(firebaseApp);

        window.firebaseTools = {
            ref,
            set,
            push,
            get,
            update
        };

        return firebaseDB;

    } catch (error) {
        console.error("Firebase initialization failed:", error);
        alert("Unable to connect to Firebase.");
        return null;
    }
}


// ============================================================
// HELPER - CURRENT USER
// ============================================================

function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem("smartfood_currentUser")
    );
}


// ============================================================
// DEFAULT ADMIN
// ============================================================

function createDefaultAdmin() {

    let users =
        JSON.parse(localStorage.getItem("smartfood_users")) || [];

    const adminExists = users.some(function(user) {
        return user.role === "admin";
    });

    if (!adminExists) {

        const admin = {
            id: 1,
            name: "System Administrator",
            email: "admin@smartfood.com",
            password: "admin123",
            role: "admin",
            location: "System"
        };

        users.push(admin);

        localStorage.setItem(
            "smartfood_users",
            JSON.stringify(users)
        );
    }
}


// ============================================================
// REGISTER USER
// ============================================================

function registerUser() {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;

    const location =
        document.getElementById("location").value.trim();

    if (
        name === "" ||
        email === "" ||
        password === "" ||
        role === "" ||
        location === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    let users =
        JSON.parse(localStorage.getItem("smartfood_users")) || [];

    const existingUser = users.find(function(user) {
        return user.email.toLowerCase() === email.toLowerCase();
    });

    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: role,
        location: location
    };

    users.push(newUser);

    localStorage.setItem(
        "smartfood_users",
        JSON.stringify(users)
    );

    alert("Registration successful!");

    window.location.href = "login.html";
}


// ============================================================
// LOGIN USER
// ============================================================

function loginUser() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;

    if (
        email === "" ||
        password === "" ||
        role === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    let users =
        JSON.parse(localStorage.getItem("smartfood_users")) || [];

    const user = users.find(function(user) {

        return (
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password &&
            user.role === role
        );

    });

    if (!user) {

        alert(
            "Invalid email, password, or account type."
        );

        return;
    }

    localStorage.setItem(
        "smartfood_currentUser",
        JSON.stringify(user)
    );

    if (user.role === "provider") {

        window.location.href =
            "provider-dashboard.html";

    } else if (user.role === "recipient") {

        window.location.href =
            "recipient-dashboard.html";

    } else if (user.role === "admin") {

        window.location.href =
            "admin-dashboard.html";
    }
}


// ============================================================
// LOGOUT
// ============================================================

function logoutUser() {

    localStorage.removeItem(
        "smartfood_currentUser"
    );

    window.location.href = "index.html";
}


// ============================================================
// ADD FOOD
// ============================================================

async function addFood() {

    const currentUser = getCurrentUser();

    if (!currentUser) {

        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const foodName =
        document.getElementById("food-name").value.trim();

    const foodType =
        document.getElementById("food-type").value;

    const quantity =
        Number(
            document.getElementById("food-quantity").value
        );

    const availableFrom =
        document.getElementById("available-from").value;

    const availableUntil =
        document.getElementById("available-until").value;

    const location =
        document.getElementById("food-location").value.trim();

    const recipientType =
        document.getElementById("recipient-type").value;

    const description =
        document.getElementById("food-description").value.trim();

    if (
        foodName === "" ||
        foodType === "" ||
        !quantity ||
        availableFrom === "" ||
        availableUntil === "" ||
        location === ""
    ) {

        alert("Please fill in all required fields.");
        return;
    }

    const db = await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        push,
        set
    } = window.firebaseTools;

    try {

        const foodRef =
            push(ref(db, "foods"));

        const foodData = {

            id: Date.now(),

            providerId:
                currentUser.id,

            providerName:
                currentUser.name,

            providerLocation:
                currentUser.location || location,

            foodName:
                foodName,

            foodType:
                foodType,

            quantity:
                quantity,

            availableFrom:
                availableFrom,

            availableUntil:
                availableUntil,

            location:
                location,

            recipientType:
                recipientType,

            description:
                description,

            status:
                "available",

            createdAt:
                new Date().toISOString()
        };

        await set(foodRef, foodData);

        alert(
            "Food listing added successfully!"
        );

        window.location.href =
            "provider-dashboard.html";

    } catch (error) {

        console.error(error);

        alert(
            "Unable to add food listing."
        );
    }
}


// ============================================================
// LOAD PROVIDER DASHBOARD
// ============================================================

async function loadProviderDashboard() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    const welcome =
        document.getElementById("providerWelcome");

    if (welcome) {

        welcome.textContent =
            "Welcome, " + currentUser.name + "!";
    }


    // --------------------------------------------------------
    // PROVIDER EXACT LOCATION
    // --------------------------------------------------------

    const providerLocation =
        document.getElementById("providerLocation");

    if (providerLocation) {

        providerLocation.textContent =
            "📍 " +
            (
                currentUser.location ||
                "Location not provided"
            );
    }


    // --------------------------------------------------------
    // LOAD FOOD LISTINGS
    // --------------------------------------------------------

    const foodList =
        document.getElementById("foodList");

    if (!foodList) {
        return;
    }

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        get
    } = window.firebaseTools;

    try {

        const snapshot =
            await get(ref(db, "foods"));

        const foods =
            snapshot.exists()
                ? Object.values(snapshot.val())
                : [];

        const providerFoods =
            foods.filter(function(food) {

                return String(food.providerId) ===
                    String(currentUser.id);
            });


        // ----------------------------------------------------
        // FOOD LIST
        // ----------------------------------------------------

        foodList.innerHTML = "";

        if (providerFoods.length === 0) {

            foodList.innerHTML =
                "<p>No food listings available.</p>";

        } else {

            providerFoods.reverse().forEach(function(food) {

                const card =
                    document.createElement("div");

                card.className =
                    "food-card";

                card.innerHTML = `

                    <h3>${food.foodName}</h3>

                    <p>
                        <strong>Type:</strong>
                        ${food.foodType}
                    </p>

                    <p>
                        <strong>Quantity:</strong>
                        ${food.quantity} meals
                    </p>

                    <p>
                        📍 <strong>Location:</strong>
                        ${food.location || "Not provided"}
                    </p>

                    <p>
                        <strong>Available:</strong>
                        ${food.availableFrom}
                        -
                        ${food.availableUntil}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${food.status}
                    </p>

                `;

                foodList.appendChild(card);
            });
        }


        // ----------------------------------------------------
        // TOTAL PREPARED
        // ----------------------------------------------------

        const totalPrepared =
            providerFoods.reduce(
                function(total, food) {

                    return total +
                        Number(food.quantity || 0);

                },
                0
            );

        const preparedElement =
            document.getElementById("providerPrepared");

        if (preparedElement) {

            preparedElement.textContent =
                totalPrepared + " Meals";
        }


        // ----------------------------------------------------
        // SURPLUS
        // ----------------------------------------------------

        const surplusElement =
            document.getElementById("providerSurplus");

        if (surplusElement) {

            surplusElement.textContent =
                totalPrepared + " Meals";
        }


        // ----------------------------------------------------
        // REQUESTS
        // ----------------------------------------------------

        await loadProviderRequests(
            currentUser,
            db
        );

    } catch (error) {

        console.error(
            "Provider dashboard error:",
            error
        );
    }
}


// ============================================================
// LOAD PROVIDER REQUESTS
// ============================================================

async function loadProviderRequests(
    currentUser,
    db
) {

    const requestList =
        document.getElementById(
            "providerRequestList"
        );

    const requestCount =
        document.getElementById(
            "providerRequestCount"
        );

    if (!requestList) {
        return;
    }

    const {
        ref,
        get
    } = window.firebaseTools;

    try {

        const snapshot =
            await get(ref(db, "requests"));

        const requests =
            snapshot.exists()
                ? Object.values(snapshot.val())
                : [];

        const providerRequests =
            requests.filter(function(request) {

                return String(request.providerId) ===
                    String(currentUser.id);
            });


        if (requestCount) {

            requestCount.textContent =
                providerRequests.length;
        }


        requestList.innerHTML = "";

        if (providerRequests.length === 0) {

            requestList.innerHTML =
                "<p>No donation requests yet.</p>";

            return;
        }


        providerRequests.reverse().forEach(
            function(request) {

                const card =
                    document.createElement("div");

                card.className =
                    "request-card";

                card.innerHTML = `

                    <h3>
                        ${request.foodName || "Food Request"}
                    </h3>

                    <p>
                        <strong>Recipient:</strong>
                        ${request.recipientName}
                    </p>

                    <p>
                        <strong>Quantity:</strong>
                        ${request.quantity} meals
                    </p>

                    <p>
                        <strong>Message:</strong>
                        ${request.message || "No message"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${request.status}
                    </p>

                    ${
                        request.status === "pending"
                        ? `
                            <button
                                onclick="acceptRequest('${request.id}')">
                                Accept
                            </button>

                            <button
                                onclick="rejectRequest('${request.id}')">
                                Reject
                            </button>
                          `
                        : ""
                    }

                    ${
                        request.status === "accepted"
                        ? `
                            <button
                                onclick="completeDonation('${request.id}')">
                                Complete Donation
                            </button>
                          `
                        : ""
                    }

                `;

                requestList.appendChild(card);
            }
        );

    } catch (error) {

        console.error(
            "Request loading error:",
            error
        );
    }
}


// ============================================================
// ACCEPT REQUEST
// ============================================================

async function acceptRequest(requestId) {

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        update
    } = window.firebaseTools;

    try {

        await update(
            ref(db, "requests/" + requestId),
            {
                status: "accepted",
                updatedAt:
                    new Date().toISOString()
            }
        );

        alert(
            "Donation request accepted."
        );

        location.reload();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to accept request."
        );
    }
}


// ============================================================
// REJECT REQUEST
// ============================================================

async function rejectRequest(requestId) {

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        update
    } = window.firebaseTools;

    try {

        await update(
            ref(db, "requests/" + requestId),
            {
                status: "rejected",
                updatedAt:
                    new Date().toISOString()
            }
        );

        alert(
            "Donation request rejected."
        );

        location.reload();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to reject request."
        );
    }
}


// ============================================================
// COMPLETE DONATION
// ============================================================

async function completeDonation(requestId) {

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        update
    } = window.firebaseTools;

    try {

        await update(
            ref(db, "requests/" + requestId),
            {
                status: "completed",
                completedAt:
                    new Date().toISOString()
            }
        );

        alert(
            "Donation marked as completed."
        );

        location.reload();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to complete donation."
        );
    }
}


// ============================================================
// LOAD RECIPIENT DASHBOARD
// ============================================================

async function loadRecipientDashboard() {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }

    const welcome =
        document.getElementById(
            "recipientWelcome"
        );

    if (welcome) {

        welcome.textContent =
            "Welcome, " + currentUser.name + "!";
    }

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        get
    } = window.firebaseTools;

    try {

        const snapshot =
            await get(ref(db, "requests"));

        const requests =
            snapshot.exists()
                ? Object.values(snapshot.val())
                : [];

        const myRequests =
            requests.filter(function(request) {

                return String(request.recipientId) ===
                    String(currentUser.id);
            });

        const requestList =
            document.getElementById(
                "recipientRequestList"
            );

        if (!requestList) {
            return;
        }

        requestList.innerHTML = "";

        if (myRequests.length === 0) {

            requestList.innerHTML =
                "<p>No food requests yet.</p>";

            return;
        }

        myRequests.reverse().forEach(
            function(request) {

                const card =
                    document.createElement("div");

                card.className =
                    "request-card";

                card.innerHTML = `

                    <h3>
                        ${request.foodName || "Food"}
                    </h3>

                    <p>
                        <strong>Provider:</strong>
                        ${request.providerName}
                    </p>

                    <p>
                        <strong>Quantity:</strong>
                        ${request.quantity} meals
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${request.status}
                    </p>

                    <p>
                        <strong>Your Message:</strong>
                        ${request.message || "No message"}
                    </p>

                `;

                requestList.appendChild(card);
            }
        );

    } catch (error) {

        console.error(
            "Recipient dashboard error:",
            error
        );
    }
}


// ============================================================
// LOAD AVAILABLE FOOD
// ============================================================

async function loadAvailableFood() {

    const foodContainer =
        document.getElementById(
            "availableFoodList"
        );

    if (!foodContainer) {
        return;
    }

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        get
    } = window.firebaseTools;

    try {

        const snapshot =
            await get(ref(db, "foods"));

        const foods =
            snapshot.exists()
                ? Object.values(snapshot.val())
                : [];

        const availableFoods =
            foods.filter(function(food) {

                return food.status === "available";
            });

        foodContainer.innerHTML = "";

        if (availableFoods.length === 0) {

            foodContainer.innerHTML =
                "<p>No food available currently.</p>";

            return;
        }

        availableFoods.forEach(
            function(food) {

                const card =
                    document.createElement("div");

                card.className =
                    "food-card";

                card.innerHTML = `

                    <h3>
                        ${food.foodName}
                    </h3>

                    <p>
                        <strong>Type:</strong>
                        ${food.foodType}
                    </p>

                    <p>
                        <strong>Quantity:</strong>
                        ${food.quantity} meals
                    </p>

                    <p>
                        📍 <strong>Location:</strong>
                        ${food.location || "Not provided"}
                    </p>

                    <p>
                        <strong>Provider:</strong>
                        ${food.providerName}
                    </p>

                    <a
                        href="food-details.html?id=${food.id}">
                        View Details
                    </a>

                `;

                foodContainer.appendChild(card);
            }
        );

    } catch (error) {

        console.error(
            "Available food error:",
            error
        );
    }
}


// ============================================================
// LOAD FOOD DETAILS
// ============================================================

async function loadFoodDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const foodId =
        params.get("id");

    if (!foodId) {
        return;
    }

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        get
    } = window.firebaseTools;

    try {

        const snapshot =
            await get(ref(db, "foods"));

        if (!snapshot.exists()) {
            return;
        }

        const foods =
            Object.values(snapshot.val());

        const food =
            foods.find(function(item) {

                return String(item.id) ===
                    String(foodId);
            });

        if (!food) {

            alert("Food listing not found.");
            return;
        }

        const nameElement =
            document.getElementById(
                "foodDetailName"
            );

        if (nameElement) {
            nameElement.textContent =
                food.foodName;
        }

        const details =
            document.getElementById(
                "foodDetails"
            );

        if (details) {

            details.innerHTML = `

                <p>
                    <strong>Food Type:</strong>
                    ${food.foodType}
                </p>

                <p>
                    <strong>Quantity:</strong>
                    ${food.quantity} meals
                </p>

                <p>
                    📍 <strong>Location:</strong>
                    ${food.location || "Not provided"}
                </p>

                <p>
                    <strong>Provider:</strong>
                    ${food.providerName}
                </p>

                <p>
                    <strong>Available From:</strong>
                    ${food.availableFrom}
                </p>

                <p>
                    <strong>Available Until:</strong>
                    ${food.availableUntil}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${food.description || "No description"}
                </p>

            `;
        }

        window.currentFood =
            food;

    } catch (error) {

        console.error(
            "Food details error:",
            error
        );
    }
}


// ============================================================
// REQUEST FOOD
// ============================================================

async function requestFood() {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {

        alert("Please login first.");
        window.location.href =
            "login.html";

        return;
    }

    const food =
        window.currentFood;

    if (!food) {

        alert(
            "Food information not available."
        );

        return;
    }

    const quantityElement =
        document.getElementById(
            "request-quantity"
        );

    const messageElement =
        document.getElementById(
            "request-message"
        );

    const quantity =
        Number(
            quantityElement
                ? quantityElement.value
                : food.quantity
        );

    const message =
        messageElement
            ? messageElement.value.trim()
            : "";

    if (!quantity || quantity <= 0) {

        alert(
            "Please enter a valid quantity."
        );

        return;
    }

    if (quantity > Number(food.quantity)) {

        alert(
            "Requested quantity cannot exceed available quantity."
        );

        return;
    }

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        push,
        set
    } = window.firebaseTools;

    try {

        const requestRef =
            push(ref(db, "requests"));

        const requestData = {

            id: requestRef.key,

            foodId:
                food.id,

            foodName:
                food.foodName,

            providerId:
                food.providerId,

            providerName:
                food.providerName,

            providerLocation:
                food.providerLocation ||
                food.location,

            recipientId:
                currentUser.id,

            recipientName:
                currentUser.name,

            recipientLocation:
                currentUser.location || "",

            quantity:
                quantity,

            message:
                message,

            status:
                "pending",

            createdAt:
                new Date().toISOString()
        };

        await set(
            requestRef,
            requestData
        );

        alert(
            "Food request sent successfully!"
        );

        window.location.href =
            "recipient-dashboard.html";

    } catch (error) {

        console.error(error);

        alert(
            "Unable to send food request."
        );
    }
}


// ============================================================
// WASTE TRACKER
// ============================================================

function calculateWaste() {

    const prepared =
        Number(
            document.getElementById(
                "food-prepared"
            ).value
        );

    const consumed =
        Number(
            document.getElementById(
                "food-consumed"
            ).value
        );

    const donated =
        Number(
            document.getElementById(
                "food-donated"
            ).value
        );

    const wasted =
        prepared -
        consumed -
        donated;

    const wasteElement =
        document.getElementById(
            "food-wasted"
        );

    if (wasteElement) {

        wasteElement.value =
            wasted >= 0
                ? wasted
                : 0;
    }

    const reduction =
        prepared > 0
            ? (
                ((prepared - wasted) /
                    prepared) *
                100
              ).toFixed(1)
            : 0;

    const reductionElement =
        document.getElementById(
            "reduction-percentage"
        );

    if (reductionElement) {

        reductionElement.textContent =
            reduction + "%";
    }
}


// ============================================================
// SAVE WASTE DATA
// ============================================================

function saveWasteData() {

    const prepared =
        Number(
            document.getElementById(
                "food-prepared"
            ).value
        );

    const consumed =
        Number(
            document.getElementById(
                "food-consumed"
            ).value
        );

    const donated =
        Number(
            document.getElementById(
                "food-donated"
            ).value
        );

    const wasted =
        Math.max(
            prepared -
            consumed -
            donated,
            0
        );

    const data = {

        prepared:
            prepared,

        consumed:
            consumed,

        donated:
            donated,

        wasted:
            wasted,

        date:
            new Date().toISOString()
    };

    localStorage.setItem(
        "smartfood_wasteData",
        JSON.stringify(data)
    );

    alert(
        "Waste tracking data saved successfully!"
    );
}


// ============================================================
// LOAD ANALYTICS
// ============================================================

async function loadAnalytics() {

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        get
    } = window.firebaseTools;

    try {

        const snapshot =
            await get(ref(db, "foods"));

        const foods =
            snapshot.exists()
                ? Object.values(snapshot.val())
                : [];

        let totalFood = 0;

        foods.forEach(function(food) {

            totalFood +=
                Number(food.quantity || 0);
        });

        const totalElement =
            document.getElementById(
                "totalFood"
            );

        if (totalElement) {

            totalElement.textContent =
                totalFood + " Meals";
        }

    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );
    }
}


// ============================================================
// NOTIFICATION POPUP
// ============================================================

function showNotificationPopup(
    title,
    message
) {

    const oldPopup =
        document.getElementById(
            "smartfoodNotification"
        );

    if (oldPopup) {
        oldPopup.remove();
    }

    const popup =
        document.createElement("div");

    popup.id =
        "smartfoodNotification";

    popup.style.position =
        "fixed";

    popup.style.top =
        "20px";

    popup.style.right =
        "20px";

    popup.style.width =
        "340px";

    popup.style.padding =
        "20px";

    popup.style.background =
        "white";

    popup.style.borderRadius =
        "12px";

    popup.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.2)";

    popup.style.zIndex =
        "99999";

    popup.innerHTML = `

        <div style="
            font-size:20px;
            font-weight:bold;
            margin-bottom:8px;
        ">
            🔔 ${title}
        </div>

        <div style="
            font-size:15px;
            line-height:1.5;
        ">
            ${message}
        </div>

        <button
            onclick="
                document
                .getElementById('smartfoodNotification')
                .remove();
            "
            style="
                margin-top:15px;
                padding:8px 15px;
                border:none;
                border-radius:6px;
                cursor:pointer;
            "
        >
            Close
        </button>

    `;

    document.body.appendChild(
        popup
    );

    setTimeout(function() {

        if (
            document.getElementById(
                "smartfoodNotification"
            )
        ) {

            popup.remove();
        }

    }, 8000);
}


// ============================================================
// CHECK NOTIFICATIONS
// ============================================================

async function checkNotifications() {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }

    const db =
        await initializeFirebase();

    if (!db) {
        return;
    }

    const {
        ref,
        get
    } = window.firebaseTools;

    try {

        const snapshot =
            await get(ref(db, "requests"));

        if (!snapshot.exists()) {
            return;
        }

        const requests =
            Object.values(snapshot.val());

        let shownNotifications =
            JSON.parse(
                localStorage.getItem(
                    "smartfood_shownNotifications"
                )
            ) || [];


        // ----------------------------------------------------
        // PROVIDER NOTIFICATIONS
        // ----------------------------------------------------

        if (currentUser.role === "provider") {

            const providerRequests =
                requests.filter(function(request) {

                    return String(request.providerId) ===
                        String(currentUser.id);
                });

            for (
                const request of providerRequests
            ) {

                const notificationId =
                    "provider-" +
                    request.id +
                    "-" +
                    request.status;

                if (
                    shownNotifications.includes(
                        notificationId
                    )
                ) {
                    continue;
                }

                if (
                    request.status === "pending"
                ) {

                    showNotificationPopup(
                        "New Food Request",
                        `${request.recipientName} requested ${request.quantity} meals from "${request.foodName}".`
                    );

                    shownNotifications.push(
                        notificationId
                    );

                    break;
                }
            }
        }


        // ----------------------------------------------------
        // RECIPIENT NOTIFICATIONS
        // ----------------------------------------------------

        if (currentUser.role === "recipient") {

            const recipientRequests =
                requests.filter(function(request) {

                    return String(request.recipientId) ===
                        String(currentUser.id);
                });

            for (
                const request of recipientRequests
            ) {

                const notificationId =
                    "recipient-" +
                    request.id +
                    "-" +
                    request.status;

                if (
                    shownNotifications.includes(
                        notificationId
                    )
                ) {
                    continue;
                }

                if (
                    request.status === "accepted"
                ) {

                    showNotificationPopup(
                        "Request Accepted",
                        `Your request for ${request.quantity} meals from ${request.providerName} has been accepted.`
                    );

                    shownNotifications.push(
                        notificationId
                    );

                    break;
                }

                if (
                    request.status === "rejected"
                ) {

                    showNotificationPopup(
                        "Request Rejected",
                        `Your request for "${request.foodName}" was rejected by ${request.providerName}.`
                    );

                    shownNotifications.push(
                        notificationId
                    );

                    break;
                }

                if (
                    request.status === "completed"
                ) {

                    showNotificationPopup(
                        "Donation Completed",
                        `Your donation request for "${request.foodName}" has been completed.`
                    );

                    shownNotifications.push(
                        notificationId
                    );

                    break;
                }
            }
        }


        localStorage.setItem(
            "smartfood_shownNotifications",
            JSON.stringify(
                shownNotifications
            )
        );

    } catch (error) {

        console.error(
            "Notification error:",
            error
        );
    }
}


// ============================================================
// START NOTIFICATION CHECKING
// ============================================================

function startNotificationChecking() {

    checkNotifications();

    setInterval(
        checkNotifications,
        5000
    );
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createDefaultAdmin();


        // ----------------------------------------------------
        // PROVIDER DASHBOARD
        // ----------------------------------------------------

        if (
            document.getElementById(
                "providerWelcome"
            )
        ) {

            loadProviderDashboard();
        }


        // ----------------------------------------------------
        // RECIPIENT DASHBOARD
        // ----------------------------------------------------

        if (
            document.getElementById(
                "recipientWelcome"
            )
        ) {

            loadRecipientDashboard();
        }


        // ----------------------------------------------------
        // AVAILABLE FOOD
        // ----------------------------------------------------

        if (
            document.getElementById(
                "availableFoodList"
            )
        ) {

            loadAvailableFood();
        }


        // ----------------------------------------------------
        // FOOD DETAILS
        // ----------------------------------------------------

        if (
            document.getElementById(
                "foodDetails"
            )
        ) {

            loadFoodDetails();
        }


        // ----------------------------------------------------
        // ANALYTICS
        // ----------------------------------------------------

        if (
            document.getElementById(
                "totalFood"
            )
        ) {

            loadAnalytics();
        }


        // ----------------------------------------------------
        // WASTE TRACKER
        // ----------------------------------------------------

        const preparedInput =
            document.getElementById(
                "food-prepared"
            );

        const consumedInput =
            document.getElementById(
                "food-consumed"
            );

        const donatedInput =
            document.getElementById(
                "food-donated"
            );

        if (
            preparedInput &&
            consumedInput &&
            donatedInput
        ) {

            preparedInput.addEventListener(
                "input",
                calculateWaste
            );

            consumedInput.addEventListener(
                "input",
                calculateWaste
            );

            donatedInput.addEventListener(
                "input",
                calculateWaste
            );
        }


        // ----------------------------------------------------
        // NOTIFICATIONS
        // ----------------------------------------------------

        startNotificationChecking();

    }
);
