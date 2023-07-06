import { getZoopApiHits } from "../model/vendor_call_tracking";


export async function calculateZoopCost(start_date, end_date){
    const [apiCalls, err] = await getZoopApiHits(start_date, end_date)
    if (err != null) {
        return ["Unable to get zoop info from database", err]
    }
    var cost = 0
    for (var i = 0; i< apiCalls.length; i++){
        if (apiCalls[i].status_code != 200) {
            continue
        }
        if (apiCalls[i].api_endpoint == "aadhaar endpoint") {
            cost = cost + 2.5
        } else {
            cost = cost + 1
        }
    }
    return [cost, null]
}