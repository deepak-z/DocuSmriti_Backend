import axios from 'axios';

export async function externalApiCall(method, url, body, header) {
    let headers = {"Accept": 'application/json', "content-type": "application/json"}
    if(header != null) {
        for (let [key, value] of header) {
            headers[key] = value
        }
    }
    const request = {
        method: method,
        url: url,
        headers: headers,
        body: {},
    }
    if(method == 'post'){
        request.data = body
    }
    try {
        const res = await axios(request)
        return [res.status, res.data, null]
    }
    catch(err){
        if (err.response) {
            return [err.response.status, err.response.data, err.response.data.error]
        }
        return [400, "", "INVALID PATH"]
    }
}
