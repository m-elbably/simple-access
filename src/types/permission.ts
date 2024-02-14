import { Tuple, Role } from "./common";
import { Access, IAccessInfo } from "./access";
import { Utils } from "../core";

export interface PermissionOptions {
    granted: boolean;
    access: IAccessInfo;
    grants?: Tuple;
    attributes?: Array<string>;
    scope?: Tuple;
}

export class Permission {
    private readonly _granted: boolean;
    private readonly _access: Access;
    private readonly _grants: Tuple;
    private readonly _attributes: Array<string>;
    private readonly _scope: Tuple;

    constructor(permission: PermissionOptions) {
        this._granted = permission.granted;
        this._access = new Access(permission.access);
        this._grants = permission.grants || {};
        this._attributes = permission.attributes || [];
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

    get scope(): Tuple {
        return this._scope;
    }

    /**
     * Filter data based on attributes within current permission
     * @param {Tuple} data
     * @returns {any}
     */
    filter(data: Tuple): any {
        return Utils.filter(this, data);
    }
}

export type CanReturnType<
    R extends [string, string, string],
    T extends Array<Role<R>> | Promise<Array<Role<R>>>
> = T extends Array<Role<R>> ? Permission : Promise<Permission>;
