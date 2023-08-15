import axios from 'axios';

export async function externalApiCall(method, url, body, headers) {
    headers.set("Accept", 'application/json')
    const request = {
        method: method,
        url: url,
        headers: Object.fromEntries(headers),
        data: body,
    }
    try {
        const res = await axios(request)
        return [res.status, res.data, null]
    }
    catch(err){
        if (err.response) {
            return [err.response.status, "", err.response.data.error]
        }
        return [400, "", "INVALID PATH"]
    }
}
