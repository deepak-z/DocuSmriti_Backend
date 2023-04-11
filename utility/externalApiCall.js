import axios from 'axios';

export async function externalApiCall(method, url, body, header) {
    let headers = new Map()
    headers.set("Accept", 'application/json')
    if(header != null) {
        for (let [key, value] of header) {
            headers.set(key, value)
        }
    }
    const request = {
        method: method,
        url: url,
        headers: headers,
        body: body,
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
