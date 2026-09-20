// ==========================================
// SMART FOOD WASTE MANAGEMENT SYSTEM
// JavaScript File
// ==========================================


// ---------- DEFAULT ADMIN ACCOUNT ----------

function createDefaultAdmin() {

    let users =
        JSON.parse(
            localStorage.getItem("smartfood_users")
        ) || [];


    const adminExists =
        users.some(function(user) {

            return (
                user.email === "admin@smartfood.com" &&
                user.role === "admin"
            );

        });


    if (!adminExists) {

        const adminUser = {

            id: "admin001",

            name: "SmartFood Admin",

            email: "admin@smartfood.com",

            password: "admin123",

            role: "admin"

        };


        users.push(adminUser);


        localStorage.setItem(
            "smartfood_users",
            JSON.stringify(users)
        );

    }

}



// ---------- USER REGISTRATION ----------

function registerUser() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (name === "" || email === "" || password === "" || role === "") {
        alert("Please fill in all fields.");
        return;
    }

    let users =
        JSON.parse(localStorage.getItem("smartfood_users")) || [];

    const existingUser =
        users.find(user => user.email === email);

    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password,

        role: role

    };

    users.push(newUser);

    localStorage.setItem(
        "smartfood_users",
        JSON.stringify(users)
    );

    alert("Registration successful!");

    window.location.href = "login.html";
}



// ---------- USER LOGIN ----------

function loginUser() {

    const role =
        document.getElementById("role").value;

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    if (role === "" || email === "" || password === "") {

        alert("Please fill in all fields.");

        return;

    }


    const users =
        JSON.parse(
            localStorage.getItem("smartfood_users")
        ) || [];


    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password &&
                user.role === role
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


    alert("Login successful!");


    if (role === "provider") {

        window.location.href =
            "provider-dashboard.html";

    }

    else if (role === "recipient") {

        window.location.href =
            "recipient-dashboard.html";

    }

    else if (role === "admin") {

        window.location.href =
            "admin-dashboard.html";

    }

}



// ---------- ADD SURPLUS FOOD ----------

function addFood() {

    const foodName =
        document.getElementById("food-name").value.trim();

    const foodType =
        document.getElementById("food-type").value;

    const quantity =
        Number(
            document.getElementById("quantity").value
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
        document.getElementById("description").value.trim();


    if (
        foodName === "" ||
        foodType === "" ||
        quantity <= 0 ||
        availableFrom === "" ||
        availableUntil === "" ||
        location === ""
    ) {

        alert("Please fill in all required fields.");

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem("smartfood_currentUser")
        );


    if (!currentUser) {

        alert(
            "Please login as a Food Provider first."
        );

        window.location.href = "login.html";

        return;

    }


    let foods =
        JSON.parse(
            localStorage.getItem("smartfood_foods")
        ) || [];


    const newFood = {

        id: Date.now(),

        providerId: currentUser.id,

        providerName: currentUser.name,

        foodName: foodName,

        foodType: foodType,

        quantity: quantity,

        availableFrom: availableFrom,

        availableUntil: availableUntil,

        location: location,

        recipientType: recipientType,

        description: description,

        status: "available"

    };


    foods.push(newFood);


    localStorage.setItem(
        "smartfood_foods",
        JSON.stringify(foods)
    );


    alert(
        "Surplus food published successfully!"
    );


    window.location.href =
        "provider-dashboard.html";

}



// ---------- LOAD PROVIDER FOOD LISTINGS ----------

function loadProviderFoods() {

    const foodList =
        document.getElementById("foodList");


    if (!foodList) {

        return;

    }


    const foods =
        JSON.parse(
            localStorage.getItem("smartfood_foods")
        ) || [];


    if (foods.length === 0) {

        foodList.innerHTML = `
            <p style="padding: 20px;">
                No surplus food listings yet.
            </p>
        `;

        return;

    }


    foodList.innerHTML = "";


    foods.forEach(function(food) {

        const foodItem =
            document.createElement("div");


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
                    ${food.quantity} Meals ·
                    Available until ${food.availableUntil}
                </p>

                <span class="status available-status">
                    ${food.status}
                </span>

            </div>

            <div class="food-action">

                <button
                    onclick="viewFood(${food.id})"
                >
                    View
                </button>

            </div>

        `;


        foodList.appendChild(foodItem);

    });

}



// ---------- VIEW FOOD ----------

function viewFood(foodId) {

    localStorage.setItem(
        "selectedFoodId",
        foodId
    );


    window.location.href =
        "food-details.html";

}



// ---------- AVAILABLE FOOD MARKETPLACE ----------

function loadAvailableFoods() {

    const foodList =
        document.getElementById(
            "availableFoodList"
        );


    if (!foodList) {

        return;

    }


    const foods =
        JSON.parse(
            localStorage.getItem("smartfood_foods")
        ) || [];


    displayAvailableFoods(foods);

}



// ---------- DISPLAY FOOD LISTINGS ----------

function displayAvailableFoods(foods) {

    const foodList =
        document.getElementById(
            "availableFoodList"
        );


    if (!foodList) {

        return;

    }


    if (foods.length === 0) {

        foodList.innerHTML = `

            <div
                style="
                    padding: 30px;
                    text-align: center;
                    width: 100%;
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


    foods.forEach(function(food) {

        if (food.status !== "available") {

            return;

        }


        const foodCard =
            document.createElement("div");


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
                onclick="selectFood(${food.id})"
            >
                View Details →
            </a>

        `;


        foodList.appendChild(foodCard);

    });

}



// ---------- SELECT FOOD ----------

function selectFood(foodId) {

    localStorage.setItem(
        "selectedFoodId",
        foodId
    );

}



// ---------- FILTER FOOD ----------

function filterFoods() {

    const searchInput =
        document.getElementById("foodSearch");

    const typeFilter =
        document.getElementById("foodTypeFilter");

    const locationFilter =
        document.getElementById("locationFilter");


    if (
        !searchInput ||
        !typeFilter ||
        !locationFilter
    ) {

        return;

    }


    const search =
        searchInput.value.trim().toLowerCase();


    const selectedType =
        typeFilter.value;


    const selectedLocation =
        locationFilter.value;


    const foods =
        JSON.parse(
            localStorage.getItem("smartfood_foods")
        ) || [];


    const filteredFoods =
        foods.filter(function(food) {

            const matchesSearch =
                food.foodName
                    .toLowerCase()
                    .includes(search);


            const matchesType =
                selectedType === "all" ||
                food.foodType === selectedType;


            const matchesLocation =
                selectedLocation === "all" ||
                food.location
                    .toLowerCase()
                    .includes(
                        selectedLocation.toLowerCase()
                    );


            return (
                food.status === "available" &&
                matchesSearch &&
                matchesType &&
                matchesLocation
            );

        });


    displayAvailableFoods(filteredFoods);

}



// ---------- FOOD DETAILS ----------

function loadFoodDetails() {

    const foodNameElement =
        document.getElementById("foodName");


    if (!foodNameElement) {

        return;

    }


    const selectedFoodId =
        Number(
            localStorage.getItem("selectedFoodId")
        );


    const foods =
        JSON.parse(
            localStorage.getItem("smartfood_foods")
        ) || [];


    const food =
        foods.find(function(item) {

            return item.id === selectedFoodId;

        });


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



// ---------- REQUEST FOOD ----------

function requestFood() {

    const selectedFoodId =
        Number(
            localStorage.getItem("selectedFoodId")
        );


    const foods =
        JSON.parse(
            localStorage.getItem("smartfood_foods")
        ) || [];


    const food =
        foods.find(function(item) {

            return item.id === selectedFoodId;

        });


    if (!food) {

        alert("Food listing not found.");

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem("smartfood_currentUser")
        );


    if (!currentUser) {

        alert(
            "Please login as a Recipient first."
        );

        window.location.href =
            "login.html";

        return;

    }


    if (currentUser.role !== "recipient") {

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


    if (quantity <= 0) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    if (quantity > food.quantity) {

        alert(
            "Requested quantity cannot be greater than the available quantity."
        );

        return;

    }


    let requests =
        JSON.parse(
            localStorage.getItem(
                "smartfood_requests"
            )
        ) || [];


    const newRequest = {

        id: Date.now(),

        foodId: food.id,

        providerId: food.providerId,

        providerName: food.providerName,

        foodName: food.foodName,

        recipientId: currentUser.id,

        recipientName: currentUser.name,

        quantity: quantity,

        message: message,

        status: "pending"

    };


    requests.push(newRequest);


    localStorage.setItem(
        "smartfood_requests",
        JSON.stringify(requests)
    );


    alert(
        "Food request sent successfully!"
    );


    window.location.href =
        "recipient-dashboard.html";

}



// ---------- RECIPIENT DASHBOARD ----------

function loadRecipientDashboard() {

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

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;

    }


    welcomeMessage.textContent =
        "Welcome back, " +
        currentUser.name +
        "! 👋";


    const foods =
        JSON.parse(
            localStorage.getItem(
                "smartfood_foods"
            )
        ) || [];


    const availableFoods =
        foods.filter(function(food) {

            return food.status === "available";

        });


    document.getElementById(
        "availableListings"
    ).textContent =
        availableFoods.length;


    const foodList =
        document.getElementById(
            "recommendedFoodList"
        );


    if (availableFoods.length === 0) {

        foodList.innerHTML = `

            <p style="padding: 20px;">
                No surplus food is currently available.
            </p>

        `;

    }

    else {

        foodList.innerHTML = "";


        availableFoods
            .slice(0, 3)
            .forEach(function(food) {

                const foodItem =
                    document.createElement("div");


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
                            ${food.quantity} Meals ·
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
                            onclick="selectFood(${food.id})"
                        >
                            View
                        </a>

                    </div>

                `;


                foodList.appendChild(foodItem);

            });

    }


    const allRequests =
        JSON.parse(
            localStorage.getItem(
                "smartfood_requests"
            )
        ) || [];


    const myRequests =
        allRequests.filter(function(request) {

            return request.recipientId === currentUser.id;

        });


    const mealsRequested =
        myRequests.reduce(
            function(total, request) {

                return total +
                    Number(request.quantity);

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
        myRequests.filter(function(request) {

            return (
                request.status === "pending" ||
                request.status === "accepted" ||
                request.status === "ready"
            );

        });


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
            .filter(function(request) {

                return (
                    request.status === "completed" ||
                    request.status === "received"
                );

            })
            .reduce(
                function(total, request) {

                    return total +
                        Number(request.quantity);

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


    if (myRequests.length === 0) {

        requestList.innerHTML = `

            <p style="padding: 20px;">
                You have not requested any food yet.
            </p>

        `;

    }

    else {

        requestList.innerHTML = "";


        myRequests.forEach(function(request) {

            const requestItem =
                document.createElement("div");


            requestItem.className =
                "request-item";


            let statusClass =
                "pending-status";


            if (
                request.status === "accepted" ||
                request.status === "ready" ||
                request.status === "completed" ||
                request.status === "received"
            ) {

                statusClass =
                    "available-status";

            }


            let statusText =
                request.status;


            if (request.status === "pending") {

                statusText =
                    "Pending";

            }

            else if (request.status === "accepted") {

                statusText =
                    "Accepted";

            }

            else if (request.status === "ready") {

                statusText =
                    "Ready";

            }

            else if (request.status === "completed") {

                statusText =
                    "Completed";

            }

            else if (request.status === "received") {

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


            requestList.appendChild(requestItem);

        });

    }


    const providerIds =
        new Set(
            myRequests.map(function(request) {

                return request.providerId;

            })
        );


    document.getElementById(
        "impactProviders"
    ).textContent =
        providerIds.size;

}



// ---------- PROVIDER DASHBOARD ----------

function loadProviderDashboard() {

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

        alert("Please login first.");

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
        JSON.parse(
            localStorage.getItem(
                "smartfood_foods"
            )
        ) || [];


    const myFoods =
        foods.filter(function(food) {

            return food.providerId === currentUser.id;

        });


    const foodList =
        document.getElementById(
            "foodList"
        );


    if (myFoods.length === 0) {

        foodList.innerHTML = `

            <p style="padding: 20px;">
                You have not added any surplus food yet.
            </p>

        `;

    }

    else {

        foodList.innerHTML = "";


        myFoods.forEach(function(food) {

            const foodItem =
                document.createElement("div");


            foodItem.className =
                "dashboard-food-item";


            let statusClass =
                "available-status";


            if (food.status !== "available") {

                statusClass =
                    "pending-status";

            }


            let statusText =
                food.status;


            if (food.status === "available") {

                statusText =
                    "Available";

            }

            else if (food.status === "completed") {

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
                        onclick="viewFood(${food.id})"
                    >
                        View
                    </button>

                </div>

            `;


            foodList.appendChild(foodItem);

        });

    }


    const allRequests =
        JSON.parse(
            localStorage.getItem(
                "smartfood_requests"
            )
        ) || [];


    const providerRequests =
        allRequests.filter(function(request) {

            return request.providerId === currentUser.id;

        });


    const pendingRequests =
        providerRequests.filter(function(request) {

            return request.status === "pending";

        });


    document.getElementById(
        "providerRequestCount"
    ).textContent =
        pendingRequests.length +
        " New";


    if (providerRequests.length === 0) {

        requestList.innerHTML = `

            <p style="padding: 20px;">
                No donation requests yet.
            </p>

        `;

    }

    else {

        requestList.innerHTML = "";


        providerRequests.forEach(function(request) {

            const requestItem =
                document.createElement("div");


            requestItem.className =
                "request-item";


            let statusClass =
                "pending-status";


            if (
                request.status === "accepted" ||
                request.status === "ready" ||
                request.status === "completed" ||
                request.status === "received"
            ) {

                statusClass =
                    "available-status";

            }


            let statusText =
                request.status;


            if (request.status === "pending") {

                statusText =
                    "Pending";

            }

            else if (request.status === "accepted") {

                statusText =
                    "Accepted";

            }

            else if (request.status === "rejected") {

                statusText =
                    "Rejected";

            }

            else if (request.status === "ready") {

                statusText =
                    "Ready";

            }

            else if (request.status === "completed") {

                statusText =
                    "Completed";

            }

            else if (request.status === "received") {

                statusText =
                    "Received";

            }


            let buttons = "";


            // PENDING REQUEST

            if (request.status === "pending") {

                buttons = `

                    <div class="request-buttons">

                        <button
                            class="accept-btn"
                            onclick="acceptRequest(${request.id})"
                        >
                            Accept
                        </button>

                        <button
                            class="reject-btn"
                            onclick="rejectRequest(${request.id})"
                        >
                            Reject
                        </button>

                    </div>

                `;

            }


            // ACCEPTED REQUEST

            else if (request.status === "accepted") {

                buttons = `

                    <div class="request-buttons">

                        <button
                            class="accept-btn"
                            onclick="completeDonation(${request.id})"
                        >
                            Mark Donation Complete
                        </button>

                    </div>

                `;

            }


            // COMPLETED / REJECTED / OTHER REQUESTS

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


            requestList.appendChild(requestItem);

        });

    }


    // ---------- CALCULATE DONATED MEALS ----------

    const completedRequests =
        providerRequests.filter(function(request) {

            return (
                request.status === "completed" ||
                request.status === "received"
            );

        });


    const donatedMeals =
        completedRequests.reduce(
            function(total, request) {

                return total +
                    Number(request.quantity);

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


    // ---------- CALCULATE SURPLUS ----------

    const surplusMeals =
        myFoods
            .filter(function(food) {

                return food.status === "available";

            })
            .reduce(
                function(total, food) {

                    return total +
                        Number(food.quantity);

                },
                0
            );


    document.getElementById(
        "providerSurplus"
    ).textContent =
        surplusMeals +
        " Meals";

}



// ---------- ACCEPT REQUEST ----------

function acceptRequest(requestId) {

    const requests =
        JSON.parse(
            localStorage.getItem(
                "smartfood_requests"
            )
        ) || [];


    const request =
        requests.find(function(item) {

            return item.id === requestId;

        });


    if (!request) {

        alert("Request not found.");

        return;

    }


    const foods =
        JSON.parse(
            localStorage.getItem(
                "smartfood_foods"
            )
        ) || [];


    const food =
        foods.find(function(item) {

            return item.id === request.foodId;

        });


    if (!food) {

        alert("Food listing not found.");

        return;

    }


    if (request.quantity > food.quantity) {

        alert(
            "There is not enough food available for this request."
        );

        return;

    }


    request.status =
        "accepted";


    localStorage.setItem(
        "smartfood_requests",
        JSON.stringify(requests)
    );


    alert(
        "Food request accepted successfully!"
    );


    loadProviderDashboard();

}



// ---------- REJECT REQUEST ----------

function rejectRequest(requestId) {

    const requests =
        JSON.parse(
            localStorage.getItem(
                "smartfood_requests"
            )
        ) || [];


    const request =
        requests.find(function(item) {

            return item.id === requestId;

        });


    if (!request) {

        alert("Request not found.");

        return;

    }


    request.status =
        "rejected";


    localStorage.setItem(
        "smartfood_requests",
        JSON.stringify(requests)
    );


    alert(
        "Food request rejected."
    );


    loadProviderDashboard();

}



// ---------- COMPLETE DONATION ----------

function completeDonation(requestId) {

    const requests =
        JSON.parse(
            localStorage.getItem(
                "smartfood_requests"
            )
        ) || [];


    const request =
        requests.find(function(item) {

            return item.id === requestId;

        });


    if (!request) {

        alert("Request not found.");

        return;

    }


    if (request.status !== "accepted") {

        alert(
            "Only accepted requests can be completed."
        );

        return;

    }


    const foods =
        JSON.parse(
            localStorage.getItem(
                "smartfood_foods"
            )
        ) || [];


    const food =
        foods.find(function(item) {

            return item.id === request.foodId;

        });


    if (!food) {

        alert("Food listing not found.");

        return;

    }


    // Check available quantity

    if (request.quantity > food.quantity) {

        alert(
            "There is not enough food available to complete this donation."
        );

        return;

    }


    // Reduce food quantity

    food.quantity =
        Number(food.quantity) -
        Number(request.quantity);


    // Record donated quantity

    request.donatedQuantity =
        Number(request.quantity);


    // Mark request as completed

    request.status =
        "completed";


    // If all food has been donated

    if (food.quantity === 0) {

        food.status =
            "completed";

    }


    // Save updated food listings

    localStorage.setItem(
        "smartfood_foods",
        JSON.stringify(foods)
    );


    // Save updated requests

    localStorage.setItem(
        "smartfood_requests",
        JSON.stringify(requests)
    );


    alert(
        "Donation completed successfully!"
    );


    // Refresh provider dashboard

    loadProviderDashboard();

}



// ---------- INITIALIZE PAGES ----------

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Create the default admin account
        // automatically when the website loads

        createDefaultAdmin();


        loadProviderFoods();

        loadAvailableFoods();

        loadFoodDetails();

        loadRecipientDashboard();

        loadProviderDashboard();

    }
);