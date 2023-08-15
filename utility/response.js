export async function sendResponse(res, response, err) {
    if(err != null){
        res.status(400).json({'status_code': 400, 'error': err, 'message': response})
        return
    }
    res.status(200).json({'status_code':200,'data': response})
}