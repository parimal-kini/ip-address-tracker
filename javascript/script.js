//import {API_KEY} from './credentials.js'
require('dotenv').config()
console.log(process.env.API_KEY)

const inputBar = document.querySelector(".input-bar");
const buttonSubmit = document.querySelector(".btn");
const userIP = document.querySelector(".user-ip");
const userLocation = document.querySelector(".user-location");
const userTimezone = document.querySelector(".user-timezone");
const userServiceName = document.querySelector(".user-service-name"); 
const userServiceValue = document.querySelector(".user-service");
const apiKey = process.env.API_KEY;

class IPAddressTracker{
    #map;
    #myIcon;
    #mapZoomLevel = 13
    
    renderMarkup(coordinates){
        console.log("renderMarkup called", coordinates);
        this.#map.setView(coordinates, this.#mapZoomLevel);
        L.marker(coordinates, {icon: this.#myIcon}).addTo(this.#map).openPopup();
    }
    
    getPositionOfInputIP(){
        console.log("getPositionOfInputIP called");
        const ip = inputBar.value;
        inputBar.value = "";
 
        const request = fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ip}`);
        
        request.then(reponse => reponse.json()).then(
            function(data){                
                userIP.innerHTML = data.ip;
                userLocation.innerHTML = `${data.location.city}, ${data.location.country}`;
                userTimezone.innerHTML = data.location.timezone;
        
                if(data.isp){
                    userServiceName.innerHTML = "ISP";
                    userServiceValue.innerHTML = data.isp;
                }else{
                    userServiceName.innerHTML = "USP";
                    userServiceValue.innerHTML = data.usp;
                } 
                return [data.location.lat, data.location.lng];   
            }
        ).then((coor) => this.renderMarkup(coor)).catch((err) => console.warn(err,"🎈🎈🎈"));        
    }
    
    loadMap(position){
        console.log("loadmap called");
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
        L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }).addTo(this.#map);
        
        this.#myIcon = L.icon({
            iconUrl: '../images/icon-location.svg',
            iconSize: [20, 27],
        });
        
        this.getPositionOfInputIP();
    }

    getPosition(){
        console.log("getPosition called");
        navigator.geolocation?.getCurrentPosition(
            this.loadMap.bind(this),
            function () {
                alert('Could not fetch your location');
            }
            );
        }
        
        constructor(){
        this.getPosition();
        buttonSubmit.addEventListener("click", this.getPositionOfInputIP.bind(this));
    }
}

const app = new IPAddressTracker();