import { JsonProperty } from 'json-typescript-mapper';
import { LuisEntity } from './LuisEntity';

export class TakeTurnRequest
{
    /** Array of Entity GUIDS */
    @JsonProperty('entities')
    public entities : string[]; 

    /** Array of Action GUIDS to exclude */
    @JsonProperty('action-mask')
    public actionMask : string[];

    /** Additional context in key/value form */
    @JsonProperty('context')
    public context : {};
 
    public constructor(init?:Partial<TakeTurnRequest>)
    {
        this.entities = undefined;
        this.context = undefined;      
        this.actionMask = undefined;
        (<any>Object).assign(this, init);
    }

    public ToJSON() : {}
    {
        var json = {};
        if (this.entities)  
            json['entities'] = this.entities;
        if (this.context)  
            json['context'] = this.context;
        if (this.actionMask)  
            json['action-mask'] = this.context;
        return json;
    }
}