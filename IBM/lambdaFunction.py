#
#
# main() will be run when you invoke this action
#
# @param Cloud Functions actions accept a single parameter, which must be a JSON object.
#
# @return The output of this action, which must be a JSON object.
#
#
import sys
import requests
import json


def main(dict):
    
    url = 'Insert deployed model api url here'
    
    headers = {
        'accept': 'application/x-www-form-urlencoded'
    }
    
    id_val = dict['id']
    
    data = {'urls' : ['https://b3e64e71-3522-484d-9bf6-7e7595cba22c-bluemix.cloudant.com/images/{}/image'.format(str(id_val))]}
    
    response = requests.request('POST', url, headers=headers, auth=requests.auth.HTTPBasicAuth('zCrKUxbI3qztZnMYnSHTIojweE0XBqpy', ''), data=data)
    
    res = json.loads(response.text) 
    
    detectedFurniture = set()
    
    dimensions = []
    
    for i in res['result'][0]['prediction']:
        dim = [i["xmin"], i["ymin"], i["xmin"], i["ymax"]]
        detectedFurniture.add(i['label'])
        dimensions.append(dim)
    
    
    return {"detectedFuriture": list(detectedFurniture), "dimensions": dimensions}
