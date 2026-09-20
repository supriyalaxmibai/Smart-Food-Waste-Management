// ==========================================
// SMART FOOD WASTE MANAGEMENT SYSTEM
// JavaScript File
// Firebase Shared Database Version
// Notifications Enabled
// ==========================================


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyBobsVbRVHTwk7msxkCVqSEBW3VF__E__o",

    authDomain:
        "smart-food-waste-mngmt-2026.firebaseapp.com",

    databaseURL:
        "https://smart-food-waste-mngmt-2026-default-rtdb.firebaseio.com",

    projectId:
        "smart-food-waste-mngmt-2026",

    storageBucket:
        "smart-food-waste-mngmt-2026.firebasestorage.app",

    messagingSenderId:
        "901436371265",

    appId:
        "1:901436371265:web:b3860779c7d75e43d5b1c0",

    measurementId:
        "G-8L4WFDV799"

};


// ==========================================
// FIREBASE INITIALIZATION
// ==========================================

let firebaseDatabase = null;

const firebaseReady = (async function () {

    try {

        const firebaseAppModule =
            await import(
                "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
            );

        const firebaseDatabaseModule =
            await import(
                "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js"
            );

        const app =
            firebaseAppModule.initializeApp(firebaseConfig);

        firebaseDatabase =
            firebaseDatabaseModule.getDatabase(app);

        console.log("Firebase connected successfully.");

        return true;

    }

    catch (error) {

        console.error(
            "Firebase connection failed:",
            error
        );

        alert(
            "Unable to connect to the online database. Please check your internet connection."
        );

        return false;

    }

})();


// ==========================================
// FIREBASE HELPER FUNCTIONS
// ==========================================

async function getFirebaseData(path) {

    const connected =
        await firebaseReady;

    if (!connected) {

        return {};

    }

    const {
        ref,
        get
    } =
        await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js"
        );

    const databaseReference =
        ref(
            firebaseDatabase,
            path
        );

    const snapshot =
        await get(databaseReference);

    if (snapshot.exists()) {

        return snapshot.val();

    }

    return {};

}


async function saveFirebaseData(path, data) {

    const connected =
        await firebaseReady;

    if (!connected) {

        return false;

    }

    const {
        ref,
        set
    } =
        await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js"
        );

    const databaseReference =
        ref(
            firebaseDatabase,
            path
        );

    await set(
        databaseReference,
        data
    );

    return true;

}


async function updateFirebaseData(path, data) {

    const connected =
        await firebaseReady;

    if (!connected) {

        return false;

    }

    const {
        ref,
        update
    } =
        await import(
            "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js"
        );

    const databaseReference =
        ref(
            firebaseDatabase,
            path
        );

    await update(
        databaseReference,
        data
    );

    return true;

}


// ==========================================
// POPUP NOTIFICATION SYSTEM
// ==========================================

function showNotificationPopup(
    title,
    message,
    icon = "🔔"
) {

    const existingPopup =
        document.getElementById(
            "smartfoodNotificationPopup"
        );

    if (existingPopup) {

        existingPopup.remove();

    }


    const popup =
        document.createElement("div");

    popup.id =
        "smartfoodNotificationPopup";


    popup.innerHTML = `

        <div class="smartfood-notification-icon">
            ${icon}
        </div>

        <div class="smartfood-notification-content">

            <strong>
                ${title}
            </strong>

            <p>
                ${message}
            </p>

        </div>

        <button
            class="smartfood-notification-close"
            onclick="closeNotificationPopup()"
        >
            ×
        </button>

    `;


    popup.style.position =
        "fixed";

    popup.style.top =
        "25px";

    popup.style.right =
        "25px";

    popup.style.width =
        "350px";

    popup.style.maxWidth =
        "calc(100% - 40px)";

    popup.style.background =
        "#ffffff";

    popup.style.padding =
        "18px";

    popup.style.borderRadius =
        "14px";

    popup.style.boxShadow =
        "0 10px 35px rgba(0,0,0,0.18)";

    popup.style.display =
        "flex";

    popup.style.alignItems =
        "flex-start";

    popup.style.gap =
        "12px";

    popup.style.zIndex =
        "99999";

    popup.style.border =
        "1px solid #e5e7eb";


    document.body.appendChild(
        popup
    );


    setTimeout(
        function() {

            closeNotificationPopup();

        },
        6000
    );

}


function closeNotificationPopup() {

    const popup =
        document.getElementById(
            "smartfoodNotificationPopup"
        );

    if (popup) {

        popup.remove();

    }

}


// ==========================================
// CHECK NOTIFICATIONS
// ==========================================

async function checkNotifications() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "smartfood_currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    const requests =
        await getRequests();


    const myNotifications = [];


    // ------------------------------------------
    // PROVIDER NOTIFICATIONS
    // ------------------------------------------

    if (
        currentUser.role ===
        "provider"
    ) {

        const providerRequests =
            requests.filter(
                function(request) {

                    return String(
                        request.providerId
                    ) ===
                    String(
                        currentUser.id
                    );

                }
            );


        providerRequests.forEach(
            function(request) {

                if (
                    request.status ===
                    "pending"
                ) {

                    myNotifications.push({

                        id:
                            "provider-pending-" +
                            request.id,

                        title:
                            "New Food Request",

                        message:
                            request.recipientName +
                            " requested " +
                            request.quantity +
                            " meals of " +
                            request.foodName +
                            ".",

                        icon:
                            "📨"

                    });

                }

            }
        );

    }


    // ------------------------------------------
    // RECIPIENT NOTIFICATIONS
    // ------------------------------------------

    if (
        currentUser.role ===
        "recipient"
    ) {

        const recipientRequests =
            requests.filter(
                function(request) {

                    return String(
                        request.recipientId
                    ) ===
                    String(
                        currentUser.id
                    );

                }
            );


        recipientRequests.forEach(
            function(request) {


                if (
                    request.status ===
                    "accepted"
                ) {

                    myNotifications.push({

                        id:
                            "recipient-accepted-" +
                            request.id,

                        title:
                            "Request Accepted",

                        message:
                            "Your request for " +
                            request.quantity +
                            " meals of " +
                            request.foodName +
                            " has been accepted.",

                        icon:
                            "✅"

                    });

                }


                else if (
                    request.status ===
                    "rejected"
                ) {

                    myNotifications.push({

                        id:
                            "recipient-rejected-" +
                            request.id,

                        title:
                            "Request Rejected",

                        message:
                            "Your request for " +
                            request.foodName +
                            " was rejected by the provider.",

                        icon:
                            "❌"

                    });

                }


                else if (
                    request.status ===
                    "completed"
                ) {

                    myNotifications.push({

                        id:
                            "recipient-completed-" +
                            request.id,

                        title:
                            "Donation Completed",

                        message:
                            "Your requested " +
                            request.foodName +
                            " has been marked as completed.",

                        icon:
                            "❤️"

                    });

                }

            }
        );

    }


    // ------------------------------------------
    // SHOW ONLY NEW NOTIFICATIONS
    // ------------------------------------------

    if (
        myNotifications.length ===
        0
    ) {

        return;

    }


    let shownNotifications =
        JSON.parse(
            localStorage.getItem(
                "smartfood_shownNotifications"
            )
        ) || [];


    const newNotification =
        myNotifications.find(
            function(notification) {

                return !shownNotifications.includes(
                    notification.id
                );

            }
        );


    if (!newNotification) {

        return;

    }


    shownNotifications.push(
        newNotification.id
    );


    // Keep only latest 100 notification IDs

    if (
        shownNotifications.length >
        100
    ) {

        shownNotifications =
            shownNotifications.slice(
                -100
            );

    }


    localStorage.setItem(
        "smartfood_shownNotifications",
        JSON.stringify(
            shownNotifications
        )
    );


    showNotificationPopup(
        newNotification.title,
        newNotification.message,
        newNotification.icon
    );

}


// ==========================================
// START NOTIFICATION CHECKING
// ==========================================

function startNotificationChecking() {

    checkNotifications();


    setInterval(
        function() {

            checkNotifications();

        },
        5000
    );

}


// ==========================================
// DEFAULT ADMIN ACCOUNT
// ==========================================

function createDefaultAdmin() {

    let users =
        JSON.parse(
            localStorage.getItem(
                "smartfood_users"
            )
        ) || [];


    const adminExists =
        users.some(
            function(user) {

                return (
                    user.email ===
                    "admin@smartfood.com" &&
                    user.role ===
                    "admin"
                );

            }
        );


    if (!adminExists) {

        const adminUser = {

            id:
                "admin001",

            name:
                "SmartFood Admin",

            email:
                "admin@smartfood.com",

            password:
                "admin123",

            role:
                "admin"

        };


        users.push(
            adminUser
        );


        localStorage.setItem(
            "smartfood_users",
            JSON.stringify(users)
        );

    }

}


// ==========================================
// USER REGISTRATION
// ==========================================

function registerUser() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const password =
        document.getElementById(
            "password"
        ).value;


    const role =
        document.getElementById(
            "role"
        ).value;


    if (
        name === "" ||
        email === "" ||
        password === "" ||
        role === ""
    ) {

        alert(
            "Please fill in all fields."
        );

        return;

    }


    let users =
        JSON.parse(
            localStorage.getItem(
                "smartfood_users"
            )
        ) || [];


    const existingUser =
        users.find(
            function(user) {

                return user.email ===
                    email;

            }
        );


    if (existingUser) {

        alert(
            "An account with this email already exists."
        );

        return;

    }


    const newUser = {

        id:
            Date.now(),

        name:
            name,

        email:
            email,

        password:
            password,

        role:
            role

    };


    users.push(
        newUser
    );


    localStorage.setItem(
        "smartfood_users",
        JSON.stringify(users)
    );


    alert(
        "Registration successful!"
    );


    window.location.href =
        "login.html";

}


// ==========================================
// USER LOGIN
// ==========================================

function loginUser() {

    const role =
        document.getElementById(
            "role"
        ).value;


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const password =
        document.getElementById(
            "password"
        ).value;


    if (
        role === "" ||
        email === "" ||
        password === ""
    ) {

        alert(
            "Please fill in all fields."
        );

        return;

    }


    const users =
        JSON.parse(
            localStorage.getItem(
                "smartfood_users"
            )
        ) || [];


    const user =
        users.find(
            function(user) {

                return (
                    user.email ===
                    email &&
                    user.password ===
                    password &&
                    user.role ===
                    role
                );

            }
        );


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


    // Clear old notification history
    // for this browser when logging in

    localStorage.removeItem(
        "smartfood_shownNotifications"
    );


    alert(
        "Login successful!"
    );


    if (
        role ===
        "provider"
    ) {

        window.location.href =
            "provider-dashboard.html";

    }

    else if (
        role ===
        "recipient"
    ) {

        window.location.href =
            "recipient-dashboard.html";

    }

    else if (
        role ===
        "admin"
    ) {

        window.location.href =
            "admin-dashboard.html";

    }

}


// ==========================================
// ADD SURPLUS FOOD
// ==========================================

async function addFood() {

    const foodName =
        document.getElementById(
            "food-name"
        ).value.trim();


    const foodType =
        document.getElementById(
            "food-type"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "quantity"
            ).value
        );


    const availableFrom =
        document.getElementById(
            "available-from"
        ).value;


    const availableUntil =
        document.getElementById(
            "available-until"
        ).value;


    const location =
        document.getElementById(
            "food-location"
        ).value.trim();


    const recipientType =
        document.getElementById(
            "recipient-type"
        ).value;


    const description =
        document.getElementById(
            "description"
        ).value.trim();


    if (
        foodName === "" ||
        foodType === "" ||
        quantity <= 0 ||
        availableFrom === "" ||
        availableUntil === "" ||
        location === ""
    ) {

        alert(
            "Please fill in all required fields."
        );

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "smartfood_currentUser"
            )
        );


    if (!currentUser) {

        alert(
            "Please login as a Food Provider first."
        );

        window.location.href =
            "login.html";

        return;

    }


    const newFood = {

        id:
            Date.now(),

        providerId:
            currentUser.id,

        providerName:
            currentUser.name,

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
            "available"

    };


    try {

        await saveFirebaseData(
            "foods/" +
            newFood.id,
            newFood
        );


        alert(
            "Surplus food published successfully!"
        );


        window.location.href =
            "provider-dashboard.html";

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to publish food. Please try again."
        );

    }

}


// ==========================================
// GET ALL FOOD
// ==========================================

async function getFoods() {

    const data =
        await getFirebaseData(
            "foods"
        );


    if (!data) {

        return [];

    }


    return Object.values(
        data
    );

}


// ==========================================
// LOAD PROVIDER FOOD LISTINGS
// ==========================================

async function loadProviderFoods() {

    const foodList =
        document.getElementById(
            "foodList"
        );


    if (!foodList) {

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "smartfood_currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    const foods =
        await getFoods();


    const myFoods =
        foods.filter(
            function(food) {

                return String(
                    food.providerId
                ) ===
                String(
                    currentUser.id
                );

            }
        );


    if (
        myFoods.length ===
        0
    ) {

        foodList.innerHTML = `

            <p style="padding:20px;">
                No surplus food listings yet.
            </p>

        `;

        return;

    }


    foodList.innerHTML = "";


    myFoods.forEach(
        function(food) {

            const foodItem =
                document.createElement(
                    "div"
                );


            foodItem.className =
                "dashboard-food-item";


            foodItem.innerHTML = `

                <div class="dashboard-food-icon">
                    🍱
                </div>

                <div class="food-info">

                    <h3>
                        ${food.foodName}
                    </h3>

                    <p>
                        ${food.quantity}
                        Meals · Available until
                        ${food.availableUntil}
                    </p>

                    <span class="status available-status">
                        ${food.status}
                    </span>

                </div>

                <div class="food-action">

                    <button
                        onclick="viewFood('${food.id}')"
                    >
                        View
                    </button>

                </div>

            `;


            foodList.appendChild(
                foodItem
            );

        }
    );

}


// ==========================================
// VIEW FOOD
// ==========================================

function viewFood(
    foodId
) {

    localStorage.setItem(
        "selectedFoodId",
        foodId
    );


    window.location.href =
        "food-details.html";

}


// ==========================================
// AVAILABLE FOOD MARKETPLACE
// ==========================================

async function loadAvailableFoods() {

    const foodList =
        document.getElementById(
            "availableFoodList"
        );


    if (!foodList) {

        return;

    }


    const foods =
        await getFoods();


    displayAvailableFoods(
        foods
    );

}


// ==========================================
// DISPLAY AVAILABLE FOOD
// ==========================================

function displayAvailableFoods(
    foods
) {

    const foodList =
        document.getElementById(
            "availableFoodList"
        );


    if (!foodList) {

        return;

    }


    const availableFoods =
        foods.filter(
            function(food) {

                return food.status ===
                    "available";

            }
        );


    if (
        availableFoods.length ===
        0
    ) {

        foodList.innerHTML = `

            <div
                style="
                    padding:30px;
                    text-align:center;
                    width:100%;
                "
            >

                <h3>
                    No surplus food available
                </h3>

                <p>
                    New food listings will appear here when providers
                    publish surplus food.
                </p>

            </div>

        `;

        return;

    }


    foodList.innerHTML = "";


    availableFoods.forEach(
        function(food) {

            const foodCard =
                document.createElement(
                    "div"
                );


            foodCard.className =
                "market-food-card";


            foodCard.innerHTML = `

                <div class="market-food-top">

                    <div class="market-food-icon">
                        🍱
                    </div>

                    <span class="match-badge">
                        Smart Match
                    </span>

                </div>

                <h3>
                    ${food.foodName}
                </h3>

                <p class="provider-name">
                    ${food.providerName}
                </p>

                <div class="market-food-details">

                    <div>

                        <small>
                            Quantity
                        </small>

                        <strong>
                            ${food.quantity} Meals
                        </strong>

                    </div>

                    <div>

                        <small>
                            Available Until
                        </small>

                        <strong>
                            ${food.availableUntil}
                        </strong>

                    </div>

                </div>

                <div class="market-location">

                    📍 ${food.location}

                </div>

                <a
                    href="food-details.html"
                    class="market-view-btn"
                    onclick="selectFood('${food.id}')"
                >
                    View Details →
                </a>

            `;


            foodList.appendChild(
                foodCard
            );

        }
    );

}


// ==========================================
// SELECT FOOD
// ==========================================

function selectFood(
    foodId
) {

    localStorage.setItem(
        "selectedFoodId",
        foodId
    );

}


// ==========================================
// FILTER FOOD
// ==========================================

async function filterFoods() {

    const searchInput =
        document.getElementById(
            "foodSearch"
        );


    const typeFilter =
        document.getElementById(
            "foodTypeFilter"
        );


    const locationFilter =
        document.getElementById(
            "locationFilter"
        );


    if (
        !searchInput ||
        !typeFilter ||
        !locationFilter
    ) {

        return;

    }


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedType =
        typeFilter.value;


    const selectedLocation =
        locationFilter.value;


    const foods =
        await getFoods();


    const filteredFoods =
        foods.filter(
            function(food) {

                const matchesSearch =
                    food.foodName
                        .toLowerCase()
                        .includes(
                            search
                        );


                const matchesType =
                    selectedType ===
                    "all" ||
                    food.foodType ===
                    selectedType;


                const matchesLocation =
                    selectedLocation ===
                    "all" ||
                    food.location
                        .toLowerCase()
                        .includes(
                            selectedLocation
                                .toLowerCase()
                        );


                return (
                    food.status ===
                    "available" &&
                    matchesSearch &&
                    matchesType &&
                    matchesLocation
                );

            }
        );


    displayAvailableFoods(
        filteredFoods
    );

}


// ==========================================
// FOOD DETAILS
// ==========================================

async function loadFoodDetails() {

    const foodNameElement =
        document.getElementById(
            "foodName"
        );


    if (!foodNameElement) {

        return;

    }


    const selectedFoodId =
        localStorage.getItem(
            "selectedFoodId"
        );


    const foods =
        await getFoods();


    const food =
        foods.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    selectedFoodId
                );

            }
        );


    if (!food) {

        foodNameElement.textContent =
            "Food listing not found.";

        return;

    }


    document.getElementById(
        "foodName"
    ).textContent =
        food.foodName;


    document.getElementById(
        "providerName"
    ).textContent =
        "Provided by " +
        food.providerName;


    document.getElementById(
        "foodDescription"
    ).textContent =
        food.description ||
        "No description provided by the food provider.";


    document.getElementById(
        "foodQuantity"
    ).textContent =
        food.quantity +
        " Meals";


    document.getElementById(
        "foodAvailableUntil"
    ).textContent =
        food.availableUntil;


    document.getElementById(
        "foodLocation"
    ).textContent =
        food.location;


    document.getElementById(
        "foodType"
    ).textContent =
        food.foodType;


    document.getElementById(
        "pickupLocation"
    ).textContent =
        "📍 " +
        food.location;


    document.getElementById(
        "requestAvailable"
    ).textContent =
        food.quantity +
        " Meals";


    document.getElementById(
        "requestExpires"
    ).textContent =
        food.availableUntil;


    const quantityInput =
        document.getElementById(
            "requestQuantity"
        );


    if (quantityInput) {

        quantityInput.max =
            food.quantity;


        quantityInput.value =
            Math.min(
                1,
                food.quantity
            );

    }

}


// ==========================================
// REQUEST FOOD
// ==========================================

async function requestFood() {

    const selectedFoodId =
        localStorage.getItem(
            "selectedFoodId"
        );


    const foods =
        await getFoods();


    const food =
        foods.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    selectedFoodId
                );

            }
        );


    if (!food) {

        alert(
            "Food listing not found."
        );

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "smartfood_currentUser"
            )
        );


    if (!currentUser) {

        alert(
            "Please login as a Recipient first."
        );

        window.location.href =
            "login.html";

        return;

    }


    if (
        currentUser.role !==
        "recipient"
    ) {

        alert(
            "Only recipients can request surplus food."
        );

        return;

    }


    const quantity =
        Number(
            document.getElementById(
                "requestQuantity"
            ).value
        );


    const message =
        document.getElementById(
            "requestMessage"
        ).value.trim();


    if (
        quantity <=
        0
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    if (
        quantity >
        food.quantity
    ) {

        alert(
            "Requested quantity cannot be greater than the available quantity."
        );

        return;

    }


    const newRequest = {

        id:
            Date.now(),

        foodId:
            food.id,

        providerId:
            food.providerId,

        providerName:
            food.providerName,

        foodName:
            food.foodName,

        recipientId:
            currentUser.id,

        recipientName:
            currentUser.name,

        quantity:
            quantity,

        message:
            message,

        status:
            "pending",

        createdAt:
            Date.now()

    };


    try {

        await saveFirebaseData(
            "requests/" +
            newRequest.id,
            newRequest
        );


        alert(
            "Food request sent successfully!"
        );


        window.location.href =
            "recipient-dashboard.html";

    }

    catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to send request. Please try again."
        );

    }

}


// ==========================================
// GET ALL REQUESTS
// ==========================================

async function getRequests() {

    const data =
        await getFirebaseData(
            "requests"
        );


    if (!data) {

        return [];

    }


    return Object.values(
        data
    );

}


// ==========================================
// RECIPIENT DASHBOARD
// ==========================================

async function loadRecipientDashboard() {

    const welcomeMessage =
        document.getElementById(
            "welcomeMessage"
        );


    if (!welcomeMessage) {

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "smartfood_currentUser"
            )
        );


    if (!currentUser) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;

    }


    welcomeMessage.textContent =
        "Welcome back, " +
        currentUser.name +
        "! 👋";


    const foods =
        await getFoods();


    const availableFoods =
        foods.filter(
            function(food) {

                return food.status ===
                    "available";

            }
        );


    document.getElementById(
        "availableListings"
    ).textContent =
        availableFoods.length;


    const foodList =
        document.getElementById(
            "recommendedFoodList"
        );


    if (
        availableFoods.length ===
        0
    ) {

        foodList.innerHTML = `

            <p style="padding:20px;">
                No surplus food is currently available.
            </p>

        `;

    }

    else {

        foodList.innerHTML =
            "";


        availableFoods
            .slice(
                0,
                3
            )
            .forEach(
                function(food) {

                    const foodItem =
                        document.createElement(
                            "div"
                        );


                    foodItem.className =
                        "dashboard-food-item";


                    foodItem.innerHTML = `

                        <div class="dashboard-food-icon">
                            🍱
                        </div>

                        <div class="food-info">

                            <h3>
                                ${food.foodName}
                            </h3>

                            <p>
                                ${food.quantity}
                                Meals ·
                                ${food.location}
                            </p>

                            <span class="status available-status">
                                Available
                            </span>

                        </div>

                        <div class="food-action">

                            <a
                                href="food-details.html"
                                class="food-view-link"
                                onclick="selectFood('${food.id}')"
                            >
                                View
                            </a>

                        </div>

                    `;


                    foodList.appendChild(
                        foodItem
                    );

                }
            );

    }


    const allRequests =
        await getRequests();


    const myRequests =
        allRequests.filter(
            function(request) {

                return String(
                    request.recipientId
                ) ===
                String(
                    currentUser.id
                );

            }
        );


    const mealsRequested =
        myRequests.reduce(
            function(total, request) {

                return total +
                    Number(
                        request.quantity
                    );

            },
            0
        );


    document.getElementById(
        "mealsRequested"
    ).textContent =
        mealsRequested;


    document.getElementById(
        "impactRequested"
    ).textContent =
        mealsRequested;


    const activeRequests =
        myRequests.filter(
            function(request) {

                return (
                    request.status ===
                    "pending" ||
                    request.status ===
                    "accepted" ||
                    request.status ===
                    "ready"
                );

            }
        );


    document.getElementById(
        "activeRequests"
    ).textContent =
        activeRequests.length;


    document.getElementById(
        "requestCount"
    ).textContent =
        activeRequests.length +
        " Active";


    document.getElementById(
        "impactActive"
    ).textContent =
        activeRequests.length;


    const mealsReceived =
        myRequests
            .filter(
                function(request) {

                    return (
                        request.status ===
                        "completed" ||
                        request.status ===
                        "received"
                    );

                }
            )
            .reduce(
                function(total, request) {

                    return total +
                        Number(
                            request.quantity
                        );

                },
                0
            );


    document.getElementById(
        "mealsReceived"
    ).textContent =
        mealsReceived;


    document.getElementById(
        "impactMeals"
    ).textContent =
        mealsReceived;


    document.getElementById(
        "impactReceived"
    ).textContent =
        mealsReceived;


    const requestList =
        document.getElementById(
            "requestList"
        );


    if (
        myRequests.length ===
        0
    ) {

        requestList.innerHTML = `

            <p style="padding:20px;">
                You have not requested any food yet.
            </p>

        `;

    }

    else {

        requestList.innerHTML =
            "";


        myRequests.forEach(
            function(request) {

                const requestItem =
                    document.createElement(
                        "div"
                    );


                requestItem.className =
                    "request-item";


                let statusClass =
                    "pending-status";


                if (
                    request.status ===
                    "accepted" ||
                    request.status ===
                    "ready" ||
                    request.status ===
                    "completed" ||
                    request.status ===
                    "received"
                ) {

                    statusClass =
                        "available-status";

                }


                let statusText =
                    request.status;


                if (
                    request.status ===
                    "pending"
                ) {

                    statusText =
                        "Pending";

                }

                else if (
                    request.status ===
                    "accepted"
                ) {

                    statusText =
                        "Accepted";

                }

                else if (
                    request.status ===
                    "ready"
                ) {

                    statusText =
                        "Ready";

                }

                else if (
                    request.status ===
                    "completed"
                ) {

                    statusText =
                        "Completed";

                }

                else if (
                    request.status ===
                    "received"
                ) {

                    statusText =
                        "Received";

                }


                requestItem.innerHTML = `

                    <div class="recipient-avatar">
                        🍱
                    </div>

                    <div class="request-info">

                        <h3>
                            ${request.foodName}
                        </h3>

                        <p>
                            Requested
                            ${request.quantity}
                            meals
                        </p>

                        <small>
                            Provider:
                            ${request.providerName}
                        </small>

                    </div>

                    <span
                        class="status ${statusClass}"
                    >
                        ${statusText}
                    </span>

                `;


                requestList.appendChild(
                    requestItem
                );

            }
        );

    }


    const providerIds =
        new Set(
            myRequests.map(
                function(request) {

                    return request.providerId;

                }
            )
        );


    document.getElementById(
        "impactProviders"
    ).textContent =
        providerIds.size;

}


// ==========================================
// PROVIDER DASHBOARD
// ==========================================

async function loadProviderDashboard() {

    const requestList =
        document.getElementById(
            "providerRequestList"
        );


    if (!requestList) {

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "smartfood_currentUser"
            )
        );


    if (!currentUser) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;

    }


    const providerWelcome =
        document.getElementById(
            "providerWelcome"
        );


    if (providerWelcome) {

        providerWelcome.textContent =
            "Welcome back, " +
            currentUser.name +
            "! 👋";

    }


    const foods =
        await getFoods();


    const myFoods =
        foods.filter(
            function(food) {

                return String(
                    food.providerId
                ) ===
                String(
                    currentUser.id
                );

            }
        );


    const foodList =
        document.getElementById(
            "foodList"
        );


    if (
        myFoods.length ===
        0
    ) {

        foodList.innerHTML = `

            <p style="padding:20px;">
                You have not added any surplus food yet.
            </p>

        `;

    }

    else {

        foodList.innerHTML =
            "";


        myFoods.forEach(
            function(food) {

                const foodItem =
                    document.createElement(
                        "div"
                    );


                foodItem.className =
                    "dashboard-food-item";


                let statusClass =
                    "available-status";


                if (
                    food.status !==
                    "available"
                ) {

                    statusClass =
                        "pending-status";

                }


                let statusText =
                    food.status;


                if (
                    food.status ===
                    "available"
                ) {

                    statusText =
                        "Available";

                }

                else if (
                    food.status ===
                    "completed"
                ) {

                    statusText =
                        "Completed";

                }


                foodItem.innerHTML = `

                    <div class="dashboard-food-icon">
                        🍱
                    </div>

                    <div class="food-info">

                        <h3>
                            ${food.foodName}
                        </h3>

                        <p>
                            ${food.quantity}
                            Meals ·
                            Available until
                            ${food.availableUntil}
                        </p>

                        <span class="status ${statusClass}">
                            ${statusText}
                        </span>

                    </div>

                    <div class="food-action">

                        <button
                            onclick="viewFood('${food.id}')"
                        >
                            View
                        </button>

                    </div>

                `;


                foodList.appendChild(
                    foodItem
                );

            }
        );

    }


    const allRequests =
        await getRequests();


    const providerRequests =
        allRequests.filter(
            function(request) {

                return String(
                    request.providerId
                ) ===
                String(
                    currentUser.id
                );

            }
        );


    const pendingRequests =
        providerRequests.filter(
            function(request) {

                return request.status ===
                    "pending";

            }
        );


    document.getElementById(
        "providerRequestCount"
    ).textContent =
        pendingRequests.length +
        " New";


    if (
        providerRequests.length ===
        0
    ) {

        requestList.innerHTML = `

            <p style="padding:20px;">
                No donation requests yet.
            </p>

        `;

    }

    else {

        requestList.innerHTML =
            "";


        providerRequests.forEach(
            function(request) {

                const requestItem =
                    document.createElement(
                        "div"
                    );


                requestItem.className =
                    "request-item";


                let statusClass =
                    "pending-status";


                if (
                    request.status ===
                    "accepted" ||
                    request.status ===
                    "ready" ||
                    request.status ===
                    "completed" ||
                    request.status ===
                    "received"
                ) {

                    statusClass =
                        "available-status";

                }


                let statusText =
                    request.status;


                if (
                    request.status ===
                    "pending"
                ) {

                    statusText =
                        "Pending";

                }

                else if (
                    request.status ===
                    "accepted"
                ) {

                    statusText =
                        "Accepted";

                }

                else if (
                    request.status ===
                    "rejected"
                ) {

                    statusText =
                        "Rejected";

                }

                else if (
                    request.status ===
                    "ready"
                ) {

                    statusText =
                        "Ready";

                }

                else if (
                    request.status ===
                    "completed"
                ) {

                    statusText =
                        "Completed";

                }

                else if (
                    request.status ===
                    "received"
                ) {

                    statusText =
                        "Received";

                }


                let buttons =
                    "";


                if (
                    request.status ===
                    "pending"
                ) {

                    buttons = `

                        <div class="request-buttons">

                            <button
                                class="accept-btn"
                                onclick="acceptRequest('${request.id}')"
                            >
                                Accept
                            </button>

                            <button
                                class="reject-btn"
                                onclick="rejectRequest('${request.id}')"
                            >
                                Reject
                            </button>

                        </div>

                    `;

                }


                else if (
                    request.status ===
                    "accepted"
                ) {

                    buttons = `

                        <div class="request-buttons">

                            <button
                                class="accept-btn"
                                onclick="completeDonation('${request.id}')"
                            >
                                Mark Donation Complete
                            </button>

                        </div>

                    `;

                }


                else {

                    buttons = `

                        <span class="status ${statusClass}">
                            ${statusText}
                        </span>

                    `;

                }


                requestItem.innerHTML = `

                    <div class="recipient-avatar">
                        🤝
                    </div>

                    <div class="request-info">

                        <h3>
                            ${request.recipientName}
                        </h3>

                        <p>
                            ${request.foodName}
                            -
                            ${request.quantity}
                            meals
                        </p>

                        <small>
                            ${
                                request.message ||
                                "No message provided"
                            }
                        </small>

                    </div>

                    ${buttons}

                `;


                requestList.appendChild(
                    requestItem
                );

            }
        );

    }


    const completedRequests =
        providerRequests.filter(
            function(request) {

                return (
                    request.status ===
                    "completed" ||
                    request.status ===
                    "received"
                );

            }
        );


    const donatedMeals =
        completedRequests.reduce(
            function(total, request) {

                return total +
                    Number(
                        request.quantity
                    );

            },
            0
        );


    document.getElementById(
        "providerDonated"
    ).textContent =
        donatedMeals +
        " Meals";


    document.getElementById(
        "impactDonated"
    ).textContent =
        donatedMeals;


    const surplusMeals =
        myFoods
            .filter(
                function(food) {

                    return food.status ===
                        "available";

                }
            )
            .reduce(
                function(total, food) {

                    return total +
                        Number(
                            food.quantity
                        );

                },
                0
            );


    document.getElementById(
        "providerSurplus"
    ).textContent =
        surplusMeals +
        " Meals";

}


// ==========================================
// ACCEPT REQUEST
// ==========================================

async function acceptRequest(
    requestId
) {

    const requests =
        await getRequests();


    const request =
        requests.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    requestId
                );

            }
        );


    if (!request) {

        alert(
            "Request not found."
        );

        return;

    }


    const foods =
        await getFoods();


    const food =
        foods.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    request.foodId
                );

            }
        );


    if (!food) {

        alert(
            "Food listing not found."
        );

        return;

    }


    if (
        Number(
            request.quantity
        ) >
        Number(
            food.quantity
        )
    ) {

        alert(
            "There is not enough food available for this request."
        );

        return;

    }


    request.status =
        "accepted";


    request.updatedAt =
        Date.now();


    await saveFirebaseData(
        "requests/" +
        request.id,
        request
    );


    alert(
        "Food request accepted successfully!"
    );


    await loadProviderDashboard();

}


// ==========================================
// REJECT REQUEST
// ==========================================

async function rejectRequest(
    requestId
) {

    const requests =
        await getRequests();


    const request =
        requests.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    requestId
                );

            }
        );


    if (!request) {

        alert(
            "Request not found."
        );

        return;

    }


    request.status =
        "rejected";


    request.updatedAt =
        Date.now();


    await saveFirebaseData(
        "requests/" +
        request.id,
        request
    );


    alert(
        "Food request rejected."
    );


    await loadProviderDashboard();

}


// ==========================================
// COMPLETE DONATION
// ==========================================

async function completeDonation(
    requestId
) {

    const requests =
        await getRequests();


    const request =
        requests.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    requestId
                );

            }
        );


    if (!request) {

        alert(
            "Request not found."
        );

        return;

    }


    if (
        request.status !==
        "accepted"
    ) {

        alert(
            "Only accepted requests can be completed."
        );

        return;

    }


    const foods =
        await getFoods();


    const food =
        foods.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    request.foodId
                );

            }
        );


    if (!food) {

        alert(
            "Food listing not found."
        );

        return;

    }


    if (
        Number(
            request.quantity
        ) >
        Number(
            food.quantity
        )
    ) {

        alert(
            "There is not enough food available to complete this donation."
        );

        return;

    }


    food.quantity =
        Number(
            food.quantity
        ) -
        Number(
            request.quantity
        );


    request.donatedQuantity =
        Number(
            request.quantity
        );


    request.status =
        "completed";


    request.updatedAt =
        Date.now();


    if (
        Number(
            food.quantity
        ) ===
        0
    ) {

        food.status =
            "completed";

    }


    await saveFirebaseData(
        "foods/" +
        food.id,
        food
    );


    await saveFirebaseData(
        "requests/" +
        request.id,
        request
    );


    alert(
        "Donation completed successfully!"
    );


    await loadProviderDashboard();

}


// ==========================================
// INITIALIZE PAGES
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        createDefaultAdmin();


        await firebaseReady;


        await loadProviderFoods();

        await loadAvailableFoods();

        await loadFoodDetails();

        await loadRecipientDashboard();

        await loadProviderDashboard();


        // Start checking Firebase
        // for new request/status notifications

        startNotificationChecking();

    }
);
