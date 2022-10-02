import { Tuple } from "./common";
import { Access, IAccessInfo } from "./access";
import { Utils } from "../core/utils";

export interface PermissionOptions {
    granted: boolean;
    access: IAccessInfo;
    grants?: Tuple;
    attributes?: Array<string>;
    conditions?: Array<Tuple>;
    scope?: Tuple;
}

export class Permission {
    private readonly _granted: boolean;
    private readonly _access: Access;
    private readonly _grants: Tuple;
    private readonly _attributes: Array<string>;
    private readonly _conditions: Array<Tuple>;
    private readonly _scope: Tuple;

    constructor(permission: PermissionOptions) {
        this._granted = permission.granted;
        this._access = new Access(permission.access);
        this._grants = permission.grants || {};
        this._attributes = permission.attributes || [];
        this._conditions = permission.conditions || [];
        this._scope = permission.scope || {};
    }

    get granted(): boolean {
        return this._granted;
    }

    get access(): Access {
        return this._access;
    }

    get grants(): Tuple {
        return this._grants;
    }

    get attributes(): Array<string> {
        return this._attributes;
    }

    get conditions(): Array<Tuple> {
        return this._conditions;
    }

    get scope(): Tuple {
        return this._scope;
    }

    /**
     * check if permission allows subject (user) to access object (resource),
     * role conditions will be evaluated for this check
     * @param {Tuple} subject User object
     * @param {Tuple} object Resource object
     * @returns {Promise<boolean>}
     */
    canSubjectAccessResource(subject: Tuple, object: Tuple): boolean {
        return Utils.canSubjectAccessResource(this, subject, object);
    }

    /**
     * Filter data based on attributes within current permission
     * @param {Tuple} data
     * @returns {any}
     */
    filter(data: Tuple) {
        return Utils.filter(this, data);
    }
}
