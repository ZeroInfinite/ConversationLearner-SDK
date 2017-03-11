import { JsonProperty } from 'json-typescript-mapper';
import { LuisEntity } from './LuisEntity';
import { Action } from './Action';
import { LabelEntity } from './LabelEntity';
import { LabelAction } from './LabelAction';

export class TakeTurnResponse
{
    @JsonProperty('orig-text')
    public originalText : string;

    @JsonProperty({clazz: LuisEntity, name: 'entities'})
    public entities : LuisEntity[];

    @JsonProperty('mode')
    public mode : string;

    @JsonProperty({clazz: Action, name: 'actions'})
    public actions : Action[];

    @JsonProperty({clazz: Action, name: 'action'})
    public action : Action;

    @JsonProperty('teach_step')
    public teachStep : string;

    @JsonProperty({clazz: LabelEntity, name : 'teach_label_entity'})
    public teachLabelEntities : LabelEntity[];

    @JsonProperty({clazz: LabelAction, name : 'teach_label_action'})
    public teachLabelActions : LabelAction[];

    @JsonProperty('teach_error_msg')
    public teachError : string;

    @JsonProperty('error')
    public error : string;

    public constructor(init?:Partial<TakeTurnResponse>)
    {
        this.originalText = undefined;
        this.entities = undefined;
        this.mode = undefined;
        this.actions = undefined;
        this.action = undefined;
        this.teachStep = undefined;
        this.teachLabelEntities = undefined;
        this.teachLabelActions = undefined;
        this.teachError = undefined;
        this.error = undefined;
        (<any>Object).assign(this, init);
    }
    
    public ToJSON() : {}
    {
        var json = {};
        if (this.originalText)  
            json['text'] = this.originalText;
        if (this.entities)  
            json['entities'] = this.entities;
        return json;
    }
}