document.addEventListener('DOMContentLoaded', function() {
    const restaurantList = document.getElementById('restaurant-list');
    const restaurantForm = document.getElementById('restaurant-form');
    const searchBox = document.querySelector('.search-box');
    const searchButton = document.querySelector('.search-button');
    const contactUsBtn = document.getElementById("btnLogin-popup");

    let restaurants = [];

    // Fetch initial data from the server
    fetch("http://localhost:3000/restaurants")
        .then(response => response.json())
        .then(data => {
            restaurants = data;
            renderRestaurants();
        })
        .catch(error => console.error('Error fetching data:', error));

    // Render the list of restaurants
    function renderRestaurants(filter = "") {
        restaurantList.innerHTML = '';
        const filteredRestaurants = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(filter.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(filter.toLowerCase()) ||
            restaurant.location.toLowerCase().includes(filter.toLowerCase())
        );

        filteredRestaurants.forEach((restaurant, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="restaurant-item">
                    <img src="${restaurant.image}" alt="${restaurant.name}">
                    <h3>${restaurant.name}</h3>
                    <p>${restaurant.cuisine}</p>
                    <p>${restaurant.location}</p>
                    <div class="availability-status">
                        ${restaurant.available ? '<span class="available">Available for Reservation</span>' : '<span class="sold-out">Sold Out</span>'}
                    </div>
                    <div class="actions">
                        <button onclick="editRestaurant(${index})">Edit</button>
                        <button class="delete" onclick="deleteRestaurant(${index})">Delete</button>
                        <button class="availability" onclick="toggleAvailability(${index})">${restaurant.available ? 'Available' : 'Sold Out'}</button>
                    </div>
                </div>
            `;
            restaurantList.appendChild(li);
        });
    }

    // Add a new restaurant
    restaurantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const cuisine = document.getElementById('cuisine').value;
        const location = document.getElementById('location').value;
        const image = document.getElementById('image').value;
        const newRestaurant = { name, cuisine, location, image, available: true };
        co

        fetch('http://localhost:3000/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRestaurant)
        })
        .then(response => response.json())
        .then(data => {
            restaurants.push(data);
            renderRestaurants();
            restaurantForm.reset();
        })
        .catch(error => console.error('Error adding new restaurant:', error));
    });

    // Edit a restaurant
    window.editRestaurant = function(index) {
        const restaurant = restaurants[index];
        document.getElementById('name').value = restaurant.name;
        document.getElementById('cuisine').value = restaurant.cuisine;
        document.getElementById('location').value = restaurant.location;
        document.getElementById('image').value = restaurant.image;
        deleteRestaurant(index, false);
    }

    // Delete a restaurant
    window.deleteRestaurant = function(index, removeFromArray = true) {
        const restaurant = restaurants[index];

        fetch(`http://localhost:3000/restaurants/${restaurant.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            if (removeFromArray) {
                restaurants.splice(index, 1);
            }
            renderRestaurants();
        })
        .catch(error => console.error('Error deleting restaurant:', error));
    }

    // Toggle availability status
    window.toggleAvailability = function(index) {
        restaurants[index].available = !restaurants[index].available;
        renderRestaurants();
    }

    // Search for restaurants
    searchButton.addEventListener('click', () => {
        const filter = searchBox.value.trim();
        renderRestaurants(filter);
    });

    // Redirect to the contact page
    contactUsBtn.addEventListener("click", () => {
        window.location.href = "contact_us.html";
    });
    console.log(restaurantList)

});
