let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []


//Fetch neighborhoods and cuisines when page is loaded 

document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
});


//to Fetch all neighborhoods

fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

//add neighborhoods to HTML

fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

// Fetch all cuisines and set their HTML.

fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}


fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}


//Initialize leaflet map

initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  document.getElementById('map').setAttribute('tabindex', '-1');
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiYnVzaHJhMTMiLCJhIjoiY2p4N2t3dmo0MDVxNTN4cDN1ZzI3NHNuMiJ9.B3FCvwpE-POMe7te0OKlGg',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}

//To Update page and map

updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

//clear restaurants

resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

//to add restaurants to the webpage.

fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
  UpdateTabIndex();
}

//resturant (html)

createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name + "restaurant's iconic picture"
  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.setAttribute('aria-label', 'restaurant name')
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.setAttribute('aria-label', 'restaurant neighborhood')
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.setAttribute('aria-label', 'restaurant address')
  li.append(address);

  const more = document.createElement('button');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', 'view restaurant details')
  more.onclick = function() {
    const restUrl = DBHelper.urlForRestaurant(restaurant);
    window.location = restUrl;
  }
  li.append(more)

  return li
}

//Add markers to the map.

addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    marker.on("keypress", onKeypress);
    function onKeypress() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}

UpdateTabIndex = () => {

  const LeafletControlForTabIndex = document.getElementsByClassName('leaflet-control-attribution')[0].children;
  Array.from(LeafletControlForTabIndex).forEach(marker => {
    marker.setAttribute('tabindex', '-1');
  });
}


