# Geogussr Location resolver 

A small Javascript application which finds the correct location in the online game Geogussr.

The user has the choice to place a pin in a location close to the location, place a pin on the exact location or open the location in Google Maps.

## How to use
This application is a Tampermonkey Script, therefore, you will need to install the tampermonkey extension:
- (Chromium browsers): https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
- (Firefox):  https://addons.mozilla.org/en-GB/firefox/addon/tampermonkey/

After this, just simply add the code in Release.js as a new script.

To use keys 2 and 3, follow these steps
Then, create a google api key, following https://developers.google.com/maps/documentation/javascript/get-api-key
After getting your api key, plug it into the line at the top of the script at "INSERT_GOOGLE_API_KEY_HERE"
Then, create a webhook in a discord channel. Get the webhook token, then plug it into "INSERT_DISCORD_WEBHOOK_HERE"

## To use this script:
- Press '1' to open the Google Maps set on the correct location in a new tab. (no api or webhook needed)
  
- Press '2' in game to send the location into the developer tools console (google api key needed, accessed by pressing f12) 

- Press '3' in game to send the location to a discord webhook (google api key and discord webhook link needed) 
  

## Credits:
- https://nominatim.org - For providing an API to use to reverse lookup Latitude and Longitude coordinates.
- https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging - Despite not giving me the
  exact answer I was looking for, it helped me find a way to solve the problem I was having.
- https://stackoverflow.com/questions/2694640/find-an-element-in-dom-based-on-an-attribute-value - For showing me how to use the same HTML element to access required props, regardless of gamemode.

# Disclaimer:
This ***completely ruins the fun of the game***, I made this to experiment with creating Tampermonkey scripts to modify website behaviour, to learn api requests and http posts, and because it's fun to reverse engineer this stuff.

<u>Please use at your own risk, and **don't ruin other's fun.** </u>
