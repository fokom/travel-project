//POST request function
const callAPIFromServer = async (url='', data={})=>{

    const response = await fetch(url, {
        method: 'POST',
        credential: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) 
    });

    try{
        const newData = await response.json();

        console.log('Server data{}:', newData);

        return newData;

    }catch(error){
        console.log('Error creating object[]', error);
    }
}

export { callAPIFromServer }