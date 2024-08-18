// ==UserScript==
// @name         Geoguessr Location Resolver
// @namespace    http://tampermonkey.net/
// @version      12.6
// @description  Finds Geoguessr location, then sends to a webhook
// @author       0x978
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// ==/UserScript==


// =================================================================================================================
// 'An idiot admires complexity, a genius admires simplicity'
// Learn how I made this script: https://github.com/0x978/GeoGuessr_Resolver/blob/master/howIMadeTheScript.md
// Contribute things you think will be cool once you learn: https://github.com/0x978/GeoGuessr_Resolver/pulls
// ================================================================================================================
let apikey = "INSERT_GOOGLE_API_KEY_HERE"
let webhookURL = "INSERT_DISCORD_WEBHOOK_HERE"
let globalCoordinates = { // keep this stored globally, and we'll keep updating it for each API call.
    lat: 0,
    lng: 0
}

let globalPanoID = undefined

// Below, I intercept the API call to Google Street view and view the result before it reaches the client.
// Then I simply do some regex over the response string to find the coordinates, which Google gave to us in the response data
// I then update a global variable above, with the correct coordinates, each time we receive a response from Google.

var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    // Geoguessr now calls the Google Maps API multiple times each round, with subsequent requests overwriting
    // the saved coordinates. Calls to this exact API path seems to be legitimate for now. A better solution than panoID currently?
    // Needs testing.
    if (method.toUpperCase() === 'POST' &&
        (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
         url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

        this.addEventListener('load', function () {
            let interceptedResult = this.responseText
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)[0];
            let split = match.split(",")

            let lat = Number.parseFloat(split[0])
            let lng = Number.parseFloat(split[1])


            globalCoordinates.lat = lat
            globalCoordinates.lng = lng
        });
    }
    // Call the original open function
    return originalOpen.apply(this, arguments);
};


// ====================================Placing Marker====================================

//redacted due to not wanting to use it, add it back if you want but you'll have to go to the bottom and add back the keycodes as well.
// ====================================Open In Google Maps====================================

function mapsFromCoords() { // opens new Google Maps location using coords.

    const {lat,lng} = globalCoordinates
    if (!lat || !lng) {
        return;
    }
//reverse location with coordinates from google maps api
    let request = new XMLHttpRequest();
    //you need a google api key for this, https://developers.google.com/maps/documentation/javascript/get-api-key
    request.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apikey}`);
    request.send();
    request.onload = () => {
        //if request goes through
        if (request.status ==200) {
            var response = JSON.parse(request.response)
            //send somewhat specific location
            //if you want the exact location every time, edit the variable "num" to just be 0
            var len = response.results.length;
            var orignum = len/2;
            var num = Math.round(orignum) - 2;
            //send the location to the webhook1
       request.open("POST", webhookURL);

      request.setRequestHeader('Content-type', 'application/json');

      const params = {
        username: "geoguessr demon",
        avatar_url: "",
        content: response.results[num].formatted_address
      }

      request.send(JSON.stringify(params));
        } else {
            console.log(`error ${request.status} ${request.statusText}`)
        }
        }
    }
//this function puts the json into the console, was used to see the children of the http response
//can use to 5k if you want, press f12 and go to console to see the elements
function debug() {
    const {lat,lng} = globalCoordinates
    if (!lat || !lng) {
        return;
    }
    let request2 = new XMLHttpRequest();
    request2.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apikey}`);
    request2.send();
    request2.onload = () => {
        if (request2.status ==200) {
            console.log(JSON.parse(request2.response))
                        } else {
                        console.log(`error ${request2.status} ${request2.statusText}`)
                     }
           }


}
// ====================================Controls,setup, etc.====================================


let onKeyDown = (e) => {
    // if user pressed 2
    if (e.keyCode === 50) {
        e.stopImmediatePropagation();
        debug()
    }
    //if user pressed 3
    if (e.keyCode === 51) {
        e.stopImmediatePropagation();
        mapsFromCoords(false)
    }
}

document.addEventListener("keydown", onKeyDown);
