import { callAPIFromServer } from "./postRequest"

/* 
 function to get historical weather data from api
*/
const getHistoricWData = async (dataObject, apiUrl1, apiUrl2, apiUrl3)=>{

    const response1 = await callAPIFromServer('http://localhost:8081/callAPI', {urlBase:apiUrl1})
    const response2 = await callAPIFromServer('http://localhost:8081/callAPI', {urlBase:apiUrl2})
    const response3 = await callAPIFromServer('http://localhost:8081/callAPI', {urlBase:apiUrl3})

    try{
        const storeDataOne = await response1;
        dataObject.oneYearPredictions = {
            date: storeDataOne.location.values[0].datetimeStr,
            conditions: storeDataOne.location.values[0].conditions,
            maxT: storeDataOne.location.values[0].maxt,
            minT: storeDataOne.location.values[0].mint,
            snow: storeDataOne.location.values[0].snowdepth,
            precipitation: storeDataOne.location.values[0].precip,
            precipitationCover: storeDataOne.location.values[0].precipcover
        }

        const storeDataTwo = await response2;
        dataObject.twoYearPredictions = {
            date: storeDataTwo.location.values[0].datetimeStr,
            conditions: storeDataTwo.location.values[0].conditions,
            maxT: storeDataTwo.location.values[0].maxt,
            minT: storeDataTwo.location.values[0].mint,
            snow: storeDataTwo.location.values[0].snowdepth,
            precipitation: storeDataTwo.location.values[0].precip,
            precipitationCover: storeDataTwo.location.values[0].precipcover
        }

        const storeDataThree = await response3;
        dataObject.threeYearPredictions = {
            date: storeDataThree.location.values[0].datetimeStr,
            conditions: storeDataThree.location.values[0].conditions,
            maxT: storeDataThree.location.values[0].maxt,
            minT: storeDataThree.location.values[0].mint,
            snow: storeDataThree.location.values[0].snowdepth,
            precipitation: storeDataThree.location.values[0].precip,
            precipitationCover: storeDataThree.location.values[0].precipcover
        }

        return dataObject;

    } catch(err){
        console.log('Error getting historical weather[]', err);
        alert("Error, we couldn't get historical weather data. Please try again")
    }
}

export { getHistoricWData }