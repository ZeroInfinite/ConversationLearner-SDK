const request = require('request');
import {deserialize} from 'json-typescript-mapper';
import { Credentials } from './Http/Credentials';
import { TrainDialog } from './Model/TrainDialog'; 
import { LuisEntity } from './Model/LuisEntity';
import { Action } from './Model/Action'
import { TakeTurnModes, ActionTypes } from './Model/Consts';
import { TakeTurnResponse } from './Model/TakeTurnResponse'
import { TakeTurnRequest } from './Model/TakeTurnRequest'
import { BlisDebug } from './BlisDebug';

export class BlisClient {

    private serviceUri : string;
    private credentials : Credentials;

    constructor(serviceUri : string, user : string, secret : string)
    {
        if (!serviceUri) 
        {
            BlisDebug.Log("service Uri is required");
        } 
        this.serviceUri = serviceUri;

        this.credentials = new Credentials(user, secret);
    }

    public CreateApp(name : string, luisKey : string) : Promise<string>
    {
        var apiPath = "app";

        return new Promise(
            (resolve, reject) => {
                const requestData = {
                    url: this.serviceUri + apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring(),
                    },
                    body: {
                        name: name,
                        LuisAuthKey: luisKey
                    },
                    json: true
                }
            
                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }

    public DeleteApp(appId : string) : Promise<string>
    {
        let apiPath = `app/${appId}`;

        return new Promise(
            (resolve, reject) => {
                let url = this.serviceUri+apiPath;
                const requestData = {
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    }
                }
                request.delete(url, requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }


    public StartSession(appId : string, modelId : string, teach = false, saveDialog = false) : Promise<string>
    {
        let apiPath = `app/${appId}/session2`;

        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    },
                    body: {
                        Teach: teach,
                        Save_To_Log: saveDialog,
                        ModelID: modelId
                    },
                    json: true
                }

                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }

    public EndSession(appId : string, sessionId : string) : Promise<string>
    {
        let apiPath = `app/${appId}/session2/${sessionId}`;

        return new Promise(
            (resolve, reject) => {
                let url = this.serviceUri+apiPath;
                const requestData = {
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    }
                }
                request.delete(url, requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }

                });
            }
        )
    }

    public AddEntity(appId : string, entityName : string, entityType : string, prebuiltEntityName : string) : Promise<string>
    {
        let apiPath = `app/${appId}/entity`;

        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    },
                    body: {
                        name: entityName,
                        EntityType: entityType,
                        LUISPreName: prebuiltEntityName
                    },
                    json: true
                }

                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }

    public GetEntity(appId : string, entityId) : Promise<string>
    {
        let apiPath = `app/${appId}/entity/${entityId}`;

        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    }
                }

                request.get(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body);
                    }
                });
            }
        )
    }

    public GetEntities(appId : string) : Promise<string>
    {
        let apiPath = `app/${appId}/entity`;

        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    }
                }

                request.get(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body);
                    }
                });
            }
        )
    }

    public AddAction(appId : string, content : string, requiredEntityList : string[] = null, negativeEntityList : string[] = null, prebuiltEntityName : string = null) : Promise<string>
    {
        let apiPath = `app/${appId}/action`;

        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    },
                    body: {
                        content: content,
                        RequiredEntities: requiredEntityList,
                        NegativeEntities: negativeEntityList
                    },
                    json: true
                }

                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }

    public GetAction(appId : string, actionId) : Promise<string>
    {
        let apiPath = `app/${appId}/entity/${actionId}`;

        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    }
                }

                request.get(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body);
                    }
                });
            }
        )
    }

    public GetActions(appId : string) : Promise<string>
    {
        let apiPath = `app/${appId}/action`;

        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    }
                }

                request.get(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body);
                    }
                });
            }
        )
    }

    public DeleteAction(appId : string, actionId : string) : Promise<string>
    {
        let apiPath = `app/${appId}/action/${actionId}`;

        return new Promise(
            (resolve, reject) => {
                let url = this.serviceUri+apiPath;
                const requestData = {
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    }
                }
                request.delete(url, requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }

    public TrainDialog(appId : string, traindialog : TrainDialog) : Promise<string>
    {
        let apiPath = `app/${appId}/traindialog`;
        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    },
                    json: true
                }
                requestData['body'] = traindialog;

                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }

    public TrainModel(appId : string, fromScratch : boolean = false) : Promise<string>
    {
        let apiPath = `app/${appId}/model`;
        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    },
                    body: {
                        from_scratch : fromScratch
                    },
                    json: true
                }

                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        resolve(body.id);
                    }
                });
            }
        )
    }

    private DefaultLUCallback(text: string, entities : LuisEntity[]) : TakeTurnRequest
    {
        return new TakeTurnRequest({text : text, entities: entities});
    }

    public async TakeTurn(appId : string, sessionId : string, text : string, 
                            luCallback : (text: string, entities : LuisEntity[]) => TakeTurnRequest, 
                            apiCallbacks : { string : () => TakeTurnRequest },
                            resultCallback: (response : TakeTurnResponse) => void,
                            takeTurnRequest = new TakeTurnRequest({text : text}),
                            expectedNextModes = [TakeTurnModes.Callback, TakeTurnModes.Action, TakeTurnModes.Teach]) : Promise<void>
    {
        await this.SendTurnRequest(appId, sessionId, takeTurnRequest)
        .then(async (takeTurnResponse) => {
            BlisDebug.Log(takeTurnResponse);

            if (expectedNextModes.indexOf(takeTurnResponse.mode) < 0)
            {
                var response = new TakeTurnResponse({ mode : TakeTurnModes.Error, error: `Unexpected mode ${takeTurnResponse.mode}`} );
                resultCallback(response);
            }
            if (takeTurnResponse.mode) {

                // LUIS CALLBACK
                if (takeTurnResponse.mode == TakeTurnModes.Callback)
                {
                    if (luCallback)
                    {
                        takeTurnRequest = luCallback(takeTurnResponse.originalText, takeTurnResponse.entities);
                    }
                    else
                    {
                        takeTurnRequest = this.DefaultLUCallback(takeTurnResponse.originalText, takeTurnResponse.entities);
                    }
                    expectedNextModes = [TakeTurnModes.Action, TakeTurnModes.Teach];
                    await this.TakeTurn(appId, sessionId, text, luCallback, apiCallbacks, resultCallback,takeTurnRequest,expectedNextModes);
                }
                // TEACH
                else if (takeTurnResponse.mode == TakeTurnModes.Teach)
                {
                    resultCallback(takeTurnResponse);
                }

                // ACTION
                else if (takeTurnResponse.mode == TakeTurnModes.Action)
                {
                    if (takeTurnResponse.actions[0].actionType == ActionTypes.Text)
                    {
                        resultCallback(takeTurnResponse);
                    }
                    else if (takeTurnResponse.actions[0].actionType == ActionTypes.API)
                    {
                        var apiName = takeTurnResponse.actions[0].content;
                        if (apiCallbacks[apiName])
                        {
                            takeTurnRequest = apiCallbacks[apiName]();
                            expectedNextModes = [TakeTurnModes.Action, TakeTurnModes.Teach];
                            await this.TakeTurn(appId, sessionId, text, luCallback, apiCallbacks, resultCallback,takeTurnRequest,expectedNextModes);
                        }
                        else 
                        {
                            var response = new TakeTurnResponse({ mode : TakeTurnModes.Error, error: `API ${apiName} not defined`} );
                            resultCallback(response);
                        }
                    }
                }
                else
                {
                    var response = new TakeTurnResponse({ mode : TakeTurnModes.Error, error: `mode ${response.mode} not supported by the SDK`} );
                    resultCallback(response);
                }
            }
            else
            {
                var response = new TakeTurnResponse({ mode : TakeTurnModes.Error, error: `TakeTurnResponse has no mode`} );
                resultCallback(response);
            }
        })
        .catch((text) => {
            var response = new TakeTurnResponse({ mode : TakeTurnModes.Error, error: text} );
            resultCallback(response);
        });
    }

    private SendTurnRequest(appId : string, sessionId : string, takeTurnRequest : TakeTurnRequest) : Promise<TakeTurnResponse>
    {
        let apiPath = `app/${appId}/session2/${sessionId}`;
        return new Promise(
            (resolve, reject) => {
               const requestData = {
                    url: this.serviceUri+apiPath,
                    headers: {
                        'Cookie' : this.credentials.Cookiestring()
                    },
                    json: true
                }
                requestData['body'] = takeTurnRequest.ToJSON();

                request.put(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body.message);
                    }
                    else {
                        var ttresponse = deserialize(TakeTurnResponse, body);
                        resolve(ttresponse);
                    }
                });
            }
        )
    }
}