
import { getCoordinatesFromGeonamesApiURL } from './callGeonamesApiURL'
import { callAPIFromServer } from './postRequest'
import { getHistoricWData } from './getHistoricWData'

// Object to hold geonames data
var primaryData = {};

// get image from pixabay
const getPixaImage = async(obj, baseUrl, apiKey)=>{

    try{
        const enteredCity = obj.city;
        const enteredCountry = obj.country;
        const destination = urlEncode(enteredCity);
        const countryDestination = urlEncode(enteredCountry);

        const respOne = await fetch(`${baseUrl}?key=${apiKey}&q=${destination}&per_page=3&category=nature&safesearch=true&orientation=horizontal`)
        const respTwo = await fetch(`${baseUrl}?key=${apiKey}&q=${countryDestination}&per_page=3&category=nature&safesearch=true&orientation=horizontal`)

        try{

            const destinationImg = await respOne.json();
            obj.destinationImg = destinationImg.hits[0].largeImageURL;
            console.log('obj preview', obj);
            
        }catch(error){
            
            console.log('Can\'t get city image', error);
        }

        try{

            const countryImg = await respTwo.json();
            obj.countryImg = countryImg.hits[0].largeImageURL;
            console.log('obj preview', obj);
            return obj;

        }catch(err){
            const replace = await respTwo.json();
            console.log('Can\'t get country image', err);
            return replace;
        }

    }catch(err){

        console.log('Can\'t get image', err)
    }
}

// display an image with from it's id
function displayPixaImage(obj, id){

    try{
        const placeImage = obj.destinationImg;
        const countryImg = obj.countryImg;

        const travelDiv = document.querySelector(`[data-travel-number='${id}']`)

        if(placeImage === undefined && countryImg === undefined){

            const defaultImage = 'https://cdn.pixabay.com/photo/2023/06/02/15/39/church-8035968_1280.jpg';
            
            const newElement = document.createElement('img');
            newElement.setAttribute('alt', `picture of the destination`);
            newElement.setAttribute('src', `${defaultImage}`);
            newElement.setAttribute('class', 'travel-img');
            travelDiv.insertAdjacentElement("afterbegin",newElement);
            

        } else if(placeImage === undefined){

            const newElement = document.createElement('img');
            newElement.setAttribute('alt', `picture of the destination`);
            newElement.setAttribute('src', `${countryImg}`);
            newElement.setAttribute('class', 'travel-img');
            travelDiv.insertAdjacentElement("afterbegin",newElement);
            
        }else{

            
            const newElement = document.createElement('img');
            newElement.setAttribute('alt', `picture of the destination`);
            newElement.setAttribute('src', `${placeImage}`);
            newElement.setAttribute('class', 'travel-img');
            travelDiv.insertAdjacentElement("afterbegin",newElement);
        }
        
    } catch(err){
        
        console.log('Can\'t display destination image', err)
    }
}


let travelNumber = 0;

//* APIs urls and keys *//

const geoNamesBaseURL = 'https://secure.geonames.org/searchJSON?q='

const geoNamesKey = 'naoyenimoth'

const weatherBitBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?'

const weatherBitKey = '1042448019294c60849939a25d1e12d2'

const pixabayImgBaseURL = 'https://pixabay.com/api/'

const pixabayKey = '37927117-cb2a5e13c7cd35ecc5adf49ad'

const visualCrossingBaseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?'

const visualCrossingKey = 'MPNEGHWUDAV9UUYWU6EQU9QZL'


// setTravel date function
function setTravelDate(dateInput){

    if(dayCount(dateInput) <= 365){
        return dateInput; 

    } else{
        let todayDate = new Date();
        const currentYear = todayDate.getFullYear();
        const travelDay = new Date(dateInput);
        const newTravelDate = travelDay.setFullYear(currentYear);
        return newTravelDate;
    }

}

//day counter functionality
function dayCount(userInputDate){

    //new date instance created dynamically with JS
    let d = new Date();
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const month = months[d.getMonth()];
    const day = `0${d.getDate()}`.slice(-2);

    const today = `${d.getFullYear()}-${month}-${day}`;
    const travelDate = userInputDate;

    let differenceInMs = new Date(travelDate) - new Date(today);
    let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24); 

    return differenceInDays;
}

// form validation
function formValidation(){

    const inputPlace = document.getElementById('place').value;
    const inputDate = document.getElementById('date').value;

    if(inputPlace === "" || inputPlace === " "){
        return false;

    } else if(inputDate === NaN || inputDate === ""){
        return false;

    } else{
        return true;
    }
}

// url encode
function urlEncode(userInputData){
    const uri = userInputData;
    const encoded = encodeURIComponent(uri);
    return encoded;
}

// create historic weather urls for a 3years span using visualcrossing API
const createHistoricalApiUrls = (dateInput)=>{

    const dt = setTravelDate(dateInput);
    const geoPlace = primaryData.latitude + ',' + primaryData.longitude;
    const geoPlaceEncoded = urlEncode(geoPlace);

    const oneYearAgo = ()=>{
        let setOneYear = new Date(dt);
        setOneYear.setFullYear(setOneYear.getFullYear() - 1);
        const oneYear = setOneYear.toISOString().split('.')[0];
        return oneYear;
    };

    const twoYearsAgo = ()=>{
        let setTowYears = new Date(dt);
        setTowYears.setFullYear(setTowYears.getFullYear() - 2);
        const twoYears = setTowYears.toISOString().split('.')[0];
        return twoYears;
    };

    const threeYearsAgo = ()=>{
        let setThreeYears = new Date(dt);
        setThreeYears.setFullYear(setThreeYears.getFullYear() - 3);
        const threeYears = setThreeYears.toISOString().split('.')[0];
        return threeYears;
    };

    const urls = {
        'apiURL1': `${visualCrossingBaseURL}&aggregateHours=24&startDateTime=${oneYearAgo()}&endDateTime=${oneYearAgo()}&unitGroup=metric&contentType=json&location=${geoPlaceEncoded}&locationMode=single&key=${visualCrossingKey}`,
        'apiURL2': `${visualCrossingBaseURL}&aggregateHours=24&startDateTime=${twoYearsAgo()}&endDateTime=${twoYearsAgo()}&unitGroup=metric&contentType=json&location=${geoPlaceEncoded}&locationMode=single&key=${visualCrossingKey}`,
        'apiURL3': `${visualCrossingBaseURL}&aggregateHours=24&startDateTime=${threeYearsAgo()}&endDateTime=${threeYearsAgo()}&unitGroup=metric&contentType=json&location=${geoPlaceEncoded}&locationMode=single&key=${visualCrossingKey}`
    }

    return urls;
} 

//launch() function : Main project function
function launch(){

    document.getElementById('generate').addEventListener('click', executeGenerateAction);

    // function to run when generate event is clicked.
    function executeGenerateAction(event){

        event.preventDefault();
        
        /* execute actions if form is validated successfully
        */

        if(formValidation() === true) {

            const travelDate = document.getElementById('date').value;
            const placeName = document.getElementById('place').value;
            const placeEncoded = urlEncode(placeName); 

            const section = document.getElementById('results');
            const divTripInfo = document.createElement('div');
            divTripInfo.setAttribute('class', 'trip-holder');
            travelNumber += 1;
            divTripInfo.setAttribute('data-travel-number', `${travelNumber}`);
            section.insertAdjacentElement('afterbegin', divTripInfo);

            //get geonames data
            getCoordinatesFromGeonamesApiURL(geoNamesBaseURL, placeEncoded, geoNamesKey)

            .then(data => { 
                //save data, get image and display it as early as possible
                primaryData = data;
                getPixaImage(primaryData, pixabayImgBaseURL, pixabayKey)
                .then(()=>{

                    displayPixaImage(primaryData, travelNumber)
                })
                return primaryData;
            })

            .then(() => { 

                if(dayCount(travelDate) < 0){ 
                    // display error
                    alert('Please enter a valid date');

                } else if(dayCount(travelDate) <= 7){ 

                    try{
                        // call api and update the UI
                        callAPIFromServer('http://localhost:8081/callAPI', {urlBase: `${weatherBitBaseURL}lat=${primaryData.latitude}&lon=${primaryData.longitude}&key=${weatherBitKey}`})
                        
                        .then((newData) => {

                            updateTheUIwith(newData, travelDate, primaryData, travelNumber)
                        });
                    
                    } catch(err){

                        console.log('Error', err)
                    }
                    
                } else { 
 
                    try{
                        const apiUrls = createHistoricalApiUrls(travelDate);
                        const url1 = apiUrls.apiURL1;
                        const url2 = apiUrls.apiURL2;
                        const url3 = apiUrls.apiURL3;

                        getHistoricWData(primaryData, url1, url2, url3)

                        .then(newObj =>{
                            
                            console.log('primary preview:', newObj)
                            updateTheUIwith(newObj, travelDate, primaryData, travelNumber)
                        });

                    }catch(err){

                        console.log('Error when building historical API URL', err)
                    }
                }
            })

        }else {
            alert('Please, fill in the empty fields')
        }
    }
}

// function to update the user interface one data has successfully been retrieved
function updateTheUIwith(apiObj, userInputDate, primaryDataObj, id){

    const country = primaryDataObj.country;
    const city = primaryDataObj.city;
    const travelDiv = document.querySelector(`[data-travel-number='${id}']`)

    const trimTrip = ()=>{

        const section = document.getElementById('results')
        const travelDiv = document.querySelector(`[data-travel-number='${id}']`)
        section.removeChild(travelDiv);
        
    }


    const departingDay = function(){

        const td = new Date(userInputDate);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[td.getMonth()];
        const newDayFormat = `${month} ${td.getDate()}, ${td.getFullYear()}`;

        return newDayFormat;

    };
    
    const daysApart = function(){

        if(dayCount(userInputDate) == 1){

            const singleDay = `${dayCount(userInputDate)} day away!`;
            return singleDay;

        } else {

            const severalDays = `${dayCount(userInputDate)} days away!`;
            return severalDays;
        }
    };
    /* If time is in a week, update UI with forecast information
    if time is over a week, update UI with historic information

    */
    if(dayCount(userInputDate) <= 7){

        const apiForecastDates = apiObj['data'];
    
        try{

            for(const day of apiForecastDates){

                const apiDateValue = day['valid_date'];

                if(apiDateValue === userInputDate){

                    const sunriseUTC = day['sunrise_ts'];
                    const sunrise = function(){
                        let sunriseTimestamp = sunriseUTC * 1000;
                        const sunriseDate = new Date(sunriseTimestamp);
                        const sunriseTime = sunriseDate.toLocaleTimeString('en-UK', {hour: '2-digit', minute: '2-digit', timeZone: `${apiObj['timezone']}`});
                        return sunriseTime;
                    };
                    
                    const sunsetUTC = day["sunset_ts"];
                    const sunset = function(){
                        let sunsetTimestamp = sunsetUTC * 1000;
                        const sunsetDate = new Date(sunsetTimestamp);
                        const sunsetTime = sunsetDate.toLocaleTimeString('en-UK', {hour: '2-digit', minute: '2-digit', timeZone: `${apiObj['timezone']}`});
                        return sunsetTime;
                    };

                    // create fragment to add to current div
                    const fragment = document.createDocumentFragment();
                    const newElement = document.createElement('div');
                    newElement.setAttribute('class', 'holder info-holder');
                    newElement.setAttribute('weather-travel-number', `${id}`);
                    newElement.innerHTML = `<div class="holder result-header">
                        <div class="travel-data">
                            <i class="icon-travel-info fas fa-map-marker-alt"></i>
                            <h2 class="travel-summary"><span class="travel-summary-info">My trip to: </span>${city}, ${country}</h2>
                        </div>
                        <div class="travel-data">
                            <i class="icon-travel-info far fa-calendar-check"></i>
                            <h2 class="travel-summary"><span class="travel-summary-info">Departing: </span>${departingDay(userInputDate)}</h2>
                        </div>
                    </div>
                    <div class="result-body">
                        <div class="counter">
                            <i class="counter-icon far fa-clock"></i>
                            <p class="counter-text">${city}, ${country} is ${daysApart()}</p>
                        </div>
                    
                        <div class="weather-holder">
                            <h3 class="result-subtitle">Weather Forecast</h3>
                            <p class="low-temp">Low: ${day["min_temp"]} °C</p>
                            <p class="high-temp">High: ${day["max_temp"]} °C</p>
                            <p class="sunrise">Sunrise: ${sunrise()}</p>
                            <p class="sunset">Sunset: ${sunset()}</p>
                            <p class="chance-of-rain">Chance of Rain: ${day.pop}%</p>
                            <p class="snow-record">Snowfall: ${day.snow} mm/hr</p>
                            
                            <div class="weather-description">
                                <i class="icon-travel-weather fas fa-cloud"></i>
                                <h4 class="round-box large-box">${day.weather.description}</h4>
                            </div>
                        </div>
                        <div id="travel-info-historical" class="holder entry-holder"></div>
                    </div>`;

                    const button = document.createElement('button');
                    button.setAttribute('class', 'remove-trip');
                    button.innerText = 'Remove Trip';
                    button.onclick=trimTrip;
                    fragment.appendChild(newElement);
                    fragment.appendChild(button);
                    travelDiv.appendChild(fragment);
                    
                    document.querySelector('.remove-trip').addEventListener('click', trimTrip)
                }
            }

        } catch(error){
            console.log('Error updating UI', error);
        }

    } else {

        const historicalDate = (dte)=>{
            const td = new Date(dte);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[td.getMonth()];
            const newDayFormat = `${td.getDate()} ${month} ${td.getFullYear()}`;
            return newDayFormat;
        };
        const checkAndSetSnowPresence = (snowData)=>{
            const zeroSnow = '0';

            if(snowData === null){
                return zeroSnow;
            } else{
                return snowData;
            }
        };

        const oneYearAgo = apiObj.oneYearPredictions.date;
        const oneYearDescription = apiObj.oneYearPredictions.conditions;
        const oneYearMaxTemp = apiObj.oneYearPredictions.maxT;
        const oneYearMinTemp = apiObj.oneYearPredictions.minT;
        const oneYearRain = apiObj.oneYearPredictions.precipitation;
        const oneYearRainPercent = apiObj.oneYearPredictions.precipitationCover;
        const oneYearSnow =apiObj.oneYearPredictions.snow;
        const oneYearSnowResult = checkAndSetSnowPresence(oneYearSnow);

        const twoYearsAgo = apiObj.twoYearPredictions.date;
        const twoYearsDescription = apiObj.twoYearPredictions.conditions;
        const twoYearsMaxTemp = apiObj.twoYearPredictions.maxT;
        const twoYearsMinTemp = apiObj.twoYearPredictions.minT;
        const twoYearsRain = apiObj.twoYearPredictions.precipitation;
        const twoYearsRainPercent = apiObj.twoYearPredictions.precipitationCover;
        const twoYearsSnow =apiObj.twoYearPredictions.snow;
        const twoYearsSnowResult = checkAndSetSnowPresence(twoYearsSnow);

        const threeYearsAgo = apiObj.threeYearPredictions.date;
        const threeYearsDescription = apiObj.threeYearPredictions.conditions;
        const threeYearsMaxTemp = apiObj.threeYearPredictions.maxT;
        const threeYearsMinTemp = apiObj.threeYearPredictions.minT;
        const threeYearsRain = apiObj.threeYearPredictions.precipitation;
        const threeYearsRainPercent = apiObj.threeYearPredictions.precipitationCover;
        const threeYearsSnow = apiObj.threeYearPredictions.snow;
        const threeYearsSnowResult = checkAndSetSnowPresence(threeYearsSnow);

        const fragment = document.createDocumentFragment();
        const newElement = document.createElement('div');
        newElement.setAttribute('class', 'holder info-holder');
        newElement.id = 'travel-info-historical';
        
        newElement.innerHTML = `<div class="holder result-header">
            <div class="travel-data">
                <i class="icon-travel-info fas fa-map-marker-alt"></i>
                <h2 class="travel-summary"><span class="travel-summary-info">My trip to: </span>${city}, ${country}</h2>
            </div>
            <div class="travel-data">
                <i class="icon-travel-info far fa-calendar-check"></i>
                <h2 class="travel-summary"><span class="travel-summary-info">Departing: </span>${departingDay(userInputDate)}</h2>
            </div>
        </div>

        <div class="result-body">
            <div class="counter">
                <i class="counter-icon far fa-map"></i>
                <p class="counter-text">${city}, ${country} is ${daysApart()}</p>
            </div>
            
            <div class="weather-holder">
                <h3 class="result-subtitle">Historical weather on this same day for the past 3 years:</h3>
                <div class="past-years-holder">
                    <div class="weather-past-years">
                        <i class="icon-travel-weather far fa-calendar"></i>
                        <h4 class="result-year">${historicalDate(oneYearAgo)}</h4>
                    </div>
                    <p class="low-temp">Low: ${oneYearMinTemp} °C</p>
                    <p class="high-temp">High: ${oneYearMaxTemp} °C</p>
                    <p class="chance-of-rain">Rain record: It rained over ${oneYearRainPercent}% of the day.</p>
                    <p class="snow-record">Snow record: ${oneYearSnowResult} cm</p>
                    <div class="weather-description">
                        <i class="icon-travel-weather fas fa-cloud"></i>
                        <p class="round-box large-box"> ${oneYearDescription}</p>
                    </div>
                </div>
                <div class="past-years-holder">
                    <div class="weather-past-years">
                        <i class="icon-travel-weather far fa-calendar"></i>
                        <h4 class="result-year">${historicalDate(twoYearsAgo)}</h4>
                    </div>
                    <p class="low-temp">Low: ${twoYearsMinTemp} °C</p>
                    <p class="high-temp">High: ${twoYearsMaxTemp} °C</p>
                    <p class="chance-of-rain">Rain record: It rained over ${twoYearsRainPercent}% of the day.</p>
                    <p class="snow-record">Snow record: ${twoYearsSnowResult} cm</p>
                    <div class="weather-description">
                        <i class="icon-travel-weather fas fa-cloud"></i>
                        <p class="round-box large-box"> ${twoYearsDescription}</p>
                    </div>
                </div>
                <div class="past-years-holder">
                    <div class="weather-past-years">
                        <i class="icon-travel-weather far fa-calendar"></i>
                        <h4 class="result-year">${historicalDate(threeYearsAgo)}</h4>
                    </div>
                    <p class="low-temp">Low: ${threeYearsMinTemp} °C</p>
                    <p class="high-temp">High: ${threeYearsMaxTemp} °C</p>
                    <p class="chance-of-rain">Rain record: It rained over ${threeYearsRainPercent}% of the day.</p>
                    <p class="snow-record">Snow record: ${threeYearsSnowResult} cm</p>
                    <div class="weather-description">
                        <i class="icon-travel-weather fas fa-cloud"></i>
                        <p class="round-box large-box"> ${threeYearsDescription}</p>
                    </div>
                </div>
            </div>
        </div>
        <button class="remove-trip">Remove Trip</button>`;

        fragment.appendChild(newElement);
        travelDiv.appendChild(fragment);

        document.querySelector('.remove-trip').addEventListener('click', trimTrip)
    }
}


export { launch }
export { createHistoricalApiUrls }