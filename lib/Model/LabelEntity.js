"use strict";
var tslib_1 = require("tslib");
var json_typescript_mapper_1 = require("json-typescript-mapper");
var Entity_1 = require("./Entity");
/** Entity matched in a user's string */
var LabelEntity = (function () {
    function LabelEntity(init) {
        this.endIndex = null;
        this.value = null;
        this.score = null;
        this.startIndex = null;
        this.id = null;
        this.metadata = null;
        this.type = null;
        this.resolution = null;
        Object.assign(this, init);
    }
    return LabelEntity;
}());
tslib_1.__decorate([
    json_typescript_mapper_1.JsonProperty('endIndex'),
    tslib_1.__metadata("design:type", Number)
], LabelEntity.prototype, "endIndex", void 0);
tslib_1.__decorate([
    json_typescript_mapper_1.JsonProperty('entity'),
    tslib_1.__metadata("design:type", String)
], LabelEntity.prototype, "value", void 0);
tslib_1.__decorate([
    json_typescript_mapper_1.JsonProperty('score'),
    tslib_1.__metadata("design:type", Number)
], LabelEntity.prototype, "score", void 0);
tslib_1.__decorate([
    json_typescript_mapper_1.JsonProperty('startindex'),
    tslib_1.__metadata("design:type", Number)
], LabelEntity.prototype, "startIndex", void 0);
tslib_1.__decorate([
    json_typescript_mapper_1.JsonProperty('id'),
    tslib_1.__metadata("design:type", String)
], LabelEntity.prototype, "id", void 0);
tslib_1.__decorate([
    json_typescript_mapper_1.JsonProperty({ clazz: Entity_1.EntityMetaData, name: 'metadata' }),
    tslib_1.__metadata("design:type", Entity_1.EntityMetaData)
], LabelEntity.prototype, "metadata", void 0);
tslib_1.__decorate([
    json_typescript_mapper_1.JsonProperty('type'),
    tslib_1.__metadata("design:type", String)
], LabelEntity.prototype, "type", void 0);
exports.LabelEntity = LabelEntity;
//# sourceMappingURL=LabelEntity.js.map