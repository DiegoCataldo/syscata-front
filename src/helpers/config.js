//START PRODUCTION
/*
export const BASE_URL = 'https://dailybackend-fbbhdydwe9g7emhk.eastus-01.azurewebsites.net/api'
*/

//end development

//START DEVELOPMENT 

export const BASE_URL = 'http://127.0.0.1:8000/api'

//END DEVELOPMENT

export const getConfig = (token) => {
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    return config
}