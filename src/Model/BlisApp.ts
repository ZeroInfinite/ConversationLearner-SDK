import * as builder from 'botbuilder';
import { deserialize } from 'json-typescript-mapper';
import { BlisUserState} from '../BlisUserState';
import { BlisDebug} from '../BlisDebug';
import { BlisClient } from '../BlisClient';
import { TakeTurnModes, EntityTypes, UserStates, TeachStep, Commands, IntCommands, ActionTypes, SaveStep, APICalls, ActionCommand } from '../Model/Consts';
import { BlisHelp, Help } from '../Model/Help'; 
import { BlisMemory } from '../BlisMemory';
import { Action } from '../Model/Action';
import { Utils } from '../Utils';import { JsonProperty } from 'json-typescript-mapper';
import { Entity } from './Entity';
import { TrainDialog } from './TrainDialog';

export class BlisApp
{
    @JsonProperty({clazz: Action, name: 'actions'})
    public actions : Action[];

    @JsonProperty({clazz: Entity, name: 'entities'})
    public entities : Entity[];

    @JsonProperty({clazz: TrainDialog, name: 'traindialogs'})
    public trainDialogs : TrainDialog[];

    @JsonProperty('blis-app-version')
    public appVersion : string;

    public constructor(init?:Partial<BlisApp>)
    {
        this.actions = undefined;
        this.entities = undefined;
        this.trainDialogs = undefined;
        this.appVersion = undefined;
        (<any>Object).assign(this, init);
    }

    public async FindTrainDialogs(client : BlisClient, appId : string, searchTerm : string) : Promise<{'dialogId': string, 'text': string}[]>
    {
        let dialogs = [];
        for (let trainDialog of this.trainDialogs)
        {
            let dialog = await trainDialog.toText(client, appId);
            if (!searchTerm || dialog.indexOf(searchTerm) > 0)
            {
                dialogs.push({'dialogId' : trainDialog.id, 'text' : dialog});
            }
        }
        return dialogs;
    }

    public static async Create(blisClient: BlisClient, userState : BlisUserState,  
            appName : string, luisKey, cb : (responses: (string | builder.IIsAttachment)[]) => void) : Promise<void>
    {
       BlisDebug.Log(`Trying to Create Application`);

        // TODO - temp debug
        if (luisKey == '*')
        {
            luisKey = '5bb9d31334f14bc5a6bd0d7c3d06094d'; // SRAL
        }
        if (luisKey == '**')
        {
            luisKey = '8d7dadb7520044c59518b5203b75e802';
        }
        

        if (!appName)
        {
            let msg = BlisHelp.CommandHelpString(Commands.CREATEAPP, `You must provide a name for your application.`);
            cb([msg]);
            return;
        }
        if (!luisKey)
        {
            let msg = BlisHelp.CommandHelpString(Commands.CREATEAPP, `You must provide a luisKey for your application.`);
            cb([msg]);
            return;
        }

        try
        {       
            let appId = await blisClient.CreateApp(appName, luisKey)

            // Initialize
            Object.assign(userState, new BlisUserState(appId));

            let card = Utils.MakeHero("Created App", appId, null, {"Help" : Help.NEWAPP});
            cb([card]);
        }
        catch (error) {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb([errMsg]);
        }
    } 


    public static async GetAll(blisClient : BlisClient, address : builder.IAddress, detail : string, cb : (text) => void) : Promise<void>
    {
        BlisDebug.Log(`Getting apps`);

        try
        { 
            // Get app ids
            let appIds = [];
            let json = await blisClient.GetApps()
            appIds = JSON.parse(json)['ids'];
            BlisDebug.Log(`Found ${appIds.length} apps`);

            if (appIds.length == 0) {
                cb(["This account contains no apps."]);
            }
            let msg = "";
            let responses = [];
            for (let appId of appIds)
            {
                let ajson = await blisClient.GetApp(appId)
                let name = ajson['app-name'];
                let id = ajson['model-id'];

                if (detail)
                {
                    responses.push(Utils.MakeHero(name, appId, null, 
                    { 
                        "Load" : `${Commands.LOADAPP} ${appId}`,
                        "Import" : `${Commands.IMPORTAPP} ${appId}`,
                        "Delete" : `${IntCommands.DELETEAPP} ${appId}`,
                    }));
                }
                else 
                {
                    msg += `${name} : ${appId}\n\n`;
                }
                BlisDebug.Log(`App lookup: ${name} : ${appId}`);
            }
            if (!detail) responses.push(msg);
            cb(responses);
        }
        catch (error) {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb(errMsg);
        }
    }

    /** Delete all apps associated with this account */
    public static async DeleteAll(blisClient : BlisClient, userState : BlisUserState,
        address : builder.IAddress, cb : (text) => void) : Promise<void>
    {
        BlisDebug.Log(`Trying to Delete All Applications`);
       
        try
        {
            // Get app ids
            let appIds = [];
            let json = await blisClient.GetApps()
            appIds = JSON.parse(json)['ids'];
            BlisDebug.Log(`Found ${appIds.length} apps`);

            for (let appId of appIds){
                let text = await blisClient.DeleteApp(userState, appId)
                BlisDebug.Log(`Deleted ${appId} apps`);
            }
            cb("Done");
        }
        catch (error)
        {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb([errMsg]);
        }
    }

    public static async Delete(blisClient : BlisClient, userState : BlisUserState, 
        appId : string, cb : (text) => void) : Promise<void>
    {
       BlisDebug.Log(`Trying to Delete Application`);
        if (!appId)
        {
            let msg = BlisHelp.Get(Help.DELETEAPP);
            cb(msg);
            return;
        }

        try
        {       
            await blisClient.DeleteApp(userState, appId)
            cb(`Deleted App ${appId}`)
        }
        catch (error) {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb(errMsg);
        }
    }

    public static async Export(blisClient : BlisClient, userState : BlisUserState, address : builder.IAddress, bot: builder.UniversalBot, cb : (text) => void) : Promise<void>
    {
        BlisDebug.Log(`Exporting App`);

        try
        {        
            // Get actions
            let dialogIds = [];
            let blisapp = await blisClient.ExportApp(userState[UserStates.APP])
            let msg = JSON.stringify(blisapp);
            if (address.channelId == "emulator")
            {
                cb(msg);
            }
            else
            {
                Utils.SendAsAttachment(bot, address, msg);
                cb("");
            }
        }
        catch (error) {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb(errMsg);
        }
    }

    /** Import (and merge) application with given appId */
    public static async Import(blisClient : BlisClient, userState : BlisUserState, 
        address : builder.IAddress, appId : string, cb : (text) => void) : Promise<void>
    {
        try
        {
            // Get current app
            let currentApp = await blisClient.ExportApp(userState[UserStates.APP]);

            // Get imported app
            let mergeApp = await blisClient.ExportApp(appId);

            // Merge any duplicate entities
            mergeApp = this.MergeEntities(currentApp, mergeApp);

            // Merge any duplicate actions
            mergeApp = this.MergeActions(currentApp, mergeApp);

            // Upload merged app to currentApp
            let finalApp = await blisClient.ImportApp(userState[UserStates.APP], mergeApp);

            // reload
            let memory = new BlisMemory(userState);
            this.Load(blisClient, userState, address, memory.AppId(), (text) => {
                cb(text);
            });
        }
        catch (error)
        {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb(errMsg);
        }
    }

    /** Import application from sent attachment */  
    public static async ImportAttachment(blisClient : BlisClient, userState : BlisUserState, 
        address : builder.IAddress, attachment : builder.IAttachment, cb : (text) => void) : Promise<void>
    {
        if (attachment.contentType != "text/plain")
        {
            cb("Expected a text file for import.");
            return;
        }

        try 
        {
            var text = await Utils.ReadFromFile(attachment.contentUrl)

            // Import new training data
            let json = JSON.parse(text);
            let blisApp = deserialize(BlisApp, json);
            let newApp = await blisClient.ImportApp(userState[UserStates.APP], json)
            
            // Reload the app
            let memory = new BlisMemory(userState);
            BlisApp.Load(blisClient, userState, address, memory.AppId(), (text) => {
                cb(text);
            });
        }
        catch (error) 
        {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb(text);
        }
    }

    public static async Load(blisClient : BlisClient, userState : BlisUserState, address : builder.IAddress, appId : string, cb : (text) => void) : Promise<void>
    {
        try {
            // TODO - temp debug
            if (appId == '*')
            {
                appId = '0241bae4-ebba-45ca-88b2-2543339c4e6d';
            }

            if (!appId)
            {
                let msg = BlisHelp.CommandHelpString(Commands.LOADAPP, `You must provide the ID of the application to load.`);
                cb(msg);
                return;
            }

            // Initialize
            Object.assign(userState, new BlisUserState(appId));

            // Validate appId
            let loadedId = await blisClient.GetApp(appId)
            BlisDebug.Log(`Loaded App: ${loadedId}`);

            // Load entities to generate lookup table
            await Entity.Get(blisClient, userState, null, (text) =>
            {
                BlisDebug.Log(`Entity lookup generated`);
            }); 

            // Load actions to generate lookup table
            let numActions = await Action.Get(blisClient, userState, null, (text) =>
            {
                BlisDebug.Log(`Action lookup generated`);
            }); 

            if (numActions == 0)
            {
                cb("Application loaded.  No Actions found.");
                return;
            }
            // Load or train a new modelId
            let modelId = await blisClient.GetModel(userState[UserStates.APP]);
            if (!userState[UserStates.MODEL])
            {        
                BlisDebug.Log(`Training the model...`)    
                modelId = await blisClient.TrainModel(userState)
                BlisDebug.Log(`Model trained: ${modelId}`);
            }
            BlisDebug.Log(`Loaded Model: ${modelId}`);
            userState[UserStates.MODEL]  = modelId;

            // Create session
            BlisDebug.Log(`Creating session...`);
            let sessionId = await blisClient.StartSession(userState[UserStates.APP])
            BlisDebug.Log(`Stared Session: ${appId}`);
            new BlisMemory(userState).StartSession(sessionId, false);
            cb("Application loaded and Session started.");
        }
        catch (error)
        {
            let errMsg = Utils.ErrorString(error);
            BlisDebug.Error(errMsg);
            cb(errMsg);
        }
    }

    /** Swap matched items in swapList */
    private static SwapMatches(ids : string[], swapList : {})
    {
        if (Object.keys(swapList).length == 0)
        {
            return ids;
        }
        let items = [];
        for (let id of ids)
        {
            if (swapList[id])
            {
                items.push(swapList[id]);
            }
            else
            {
                items.push(id);
            }
        }
        return items;
    }

    /** Merge entites */
    private static MergeEntities(app1 : BlisApp, app2 : BlisApp) : BlisApp
    {
        // Find duplicate entities, use originals from app1
        let mergedEntities = [];
        let swapList = {};
        for (let entity2 of app2.entities)
        {
            let swap = false;
            for (let entity1 of app1.entities)
            {
                // If entity name is same, use original entity
                if (entity1.Equal(entity2)) 
                {
                    swapList[entity2.id] = entity1.id;
                    swap = true;
                    break;
                }
            }
            if (!swap) {
                mergedEntities.push(entity2);
            }
        }
        app2.entities = mergedEntities;

        // Make sure all other entity references are correct
        for (let action of app2.actions)
        {
            // Swap entities
            action.negativeEntities = this.SwapMatches(action.negativeEntities, swapList);
            action.requiredEntities = this.SwapMatches(action.requiredEntities, swapList);
        }
        
        // Now swap entities for training dialogs
        for (let trainDialog of app2.trainDialogs)
        {
            for (let turn of trainDialog.dialog.turns)
            {
                turn.input.entityIds = this.SwapMatches(turn.input.entityIds, swapList);
            }       
        }
        return app2;
    }

    /** Merge actions */
    private static MergeActions(app1 : BlisApp, app2 : BlisApp) : BlisApp
    {
        // Find duplicate actions, use originals from app1
        let mergedActions = [];
        let swapList = {};
        for (let action2 of app2.actions)
        {
            let swap = false;
            for (let action1 of app1.actions)
            {
                // If entity name is same, use original entity
                if (action1.Equal(action2)) 
                {
                    swapList[action2.id] = action1.id;
                    swap = true;
                    break;
                }
            }
            if (!swap) {
                mergedActions.push(action2);
            }
        }
        app2.actions = mergedActions;

        // Now swap actions in training dialogs
        for (let trainDialog of app2.trainDialogs)
        {
            for (let turn of trainDialog.dialog.turns)
            {
                let swapAction = swapList[turn.actionId];
                if (swapAction)
                {
                    turn.actionId = swapAction;
                }
                turn.input.maskedActionIds = this.SwapMatches(turn.input.maskedActionIds, swapList);
            }       
        }
        return app2;
    }
}