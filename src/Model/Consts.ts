export const TakeTurnModes =
{
    CALLBACK : "lu_callback",
    TEACH :  "teach",
    ACTION :  "action",
    ERROR : "error"
}

export const ActionTypes =
{
    TEXT : "text",
    API : "api"
}

export const EntityTypes =
{
    LOCAL : "LOCAL",
    LUIS : "LUIS"
}

export const TeachStep =
{
    LABELENTITY : "label_entity",
    LABELACTION : "label_action"
}

export const SaveStep =
{
    INPUT : "input",
    ENTITY : "entity",
    RESPONSE : "response"
}

export const Commands =
{
    ACTIONS : "!actions",
    ADDENTITY : "!addentity",
    ADDTEXTACTION : "!addtextaction",
    ADDAPIACTION : "!addapiaction",
    APPS : "!apps",
    CREATEAPP : "!createapp",
    DEBUG : "!debug",
    DEBUGHELP : "!debughelp",
    DELETEACTION : "!deleteaction",
    DELETEALLAPPS: "!deleteallapps",
    DELETEAPP : "!deleteapp",
    DUMP : "!dump",
    ENTITIES : "!entities",
    FORGETTRAIN : "!forgettrain",
    DONETRAIN : "!donetrain",
    HELP : "!help",
    LOADAPP: "!loadapp",
    SAVETRAIN: "!savetrain",
    START: "!start",
    TEACH : "!teach",
    TRAINDIALOGS : "!traindialogs",
    TRAINFROMURL : "!trainfromurl"
}

export const Help =
{
    NEWAPP : "#newapp"
}

export const UserStates =
{
    APP : "APP",
    SESSION : "SESSION",
    MODEL : "MODEL",
    TEACH: "TEACH",
    DEBUG: "DEBUG",
    MEMORY: "MEMORY",
    ENTITYLOOKUP: "ENTITYLOOKUP",
    LASTINPUT: "LASTINPUT",
    TRAINSTEPS: "TRAINSTEPS"
}
