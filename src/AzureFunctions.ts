const request = require('request');
import { BlisDebug } from './BlisDebug';

export class AzureFunctions {

    private static AFURI = `https://getstockvalue.azurewebsites.net/api/`;

    public static Call(funcName : string, args : string ) : Promise<string>
    {
        var apiPath = "app";

        return new Promise(
            (resolve, reject) => {
                const requestData = {
                    url: this.AFURI + funcName + "/" + args,
                    /*          TODO - auth          
                    headers: {
                        'Cookie' : this.credentials.Cookiestring(),
                    },*/
                    /* TODO - params
                    body: {
                        name: name,
                        LuisAuthKey: luisKey
                    },
                    */
                    json: true
                }
                BlisDebug.LogRequest("GET",apiPath, requestData);
                request.get(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body);
                    }
                    else {
                        resolve(body.Result);
                    }
                });
            }
        )
    }
}