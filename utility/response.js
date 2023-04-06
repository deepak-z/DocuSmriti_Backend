


export async function sendResponse(res, response, err) {
    if(err != null){
        res.status(400).json({'error': err, 'data': response})
        return
    }
    res.status(200).json({'data': response})
}