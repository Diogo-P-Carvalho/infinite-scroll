const imageContainer = document.querySelector('#image-container');
const loader = document.querySelector('#loader');
const errorContainer = document.querySelector('#error');

let isInitialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
const initalCount = 5;
const apiKey = UNSPLASH_API_KEY;
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initalCount}`

// Update api url with a new image count
function updateApiUrlCount(newCount) {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}`
}

// Check if all images were loaded
function imageLoaded() {    
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;    
    }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create elements for links and photos, add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    // run function for each object in photosArray
    photosArray.forEach(photo => {
        // create <a> to link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        // create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });
        // event listener, check when each photo is finished loading
        img.addEventListener('load', imageLoaded);
        // put <img> inside <a>, then both inside imageContainer element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})

// Get photos from unsplash api
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad) {
            updateApiUrlCount(30);
            isInitialLoad = false;
        }
    } catch (error) {
        // catch error here
        console.log(error);
        loader.hidden = true;
        errorContainer.hidden = false;
    }
}

// On Load
getPhotos();
