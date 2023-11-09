import { getCoordinatesFromGeonamesApiURL } from "../src/client/js/callGeonamesApiURL"

describe("Testing the functin definition presence", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.  
    test("Testing the getCoordinatesFromGeonamesApiURL() function", () => {
        expect(getCoordinatesFromGeonamesApiURL).toBeDefined();
    }) 
});