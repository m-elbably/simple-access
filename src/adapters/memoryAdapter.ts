import { BaseAdapter } from "./baseAdapter";
import { Role, ErrorEx } from "../types";

export class MemoryAdapter extends BaseAdapter<Array<Role>> {
    private _roles: Array<Role>;
    private _cache: { [k: string]: Role } = {};

    constructor(roles: Array<Role>) {
        super("MemoryAdapter");
        this.setRoles(roles);
    }

    setRoles(roles: Array<Role>): void {
        if (roles == null || !Array.isArray(roles) || roles.length === 0) {
            throw new ErrorEx(
                ErrorEx.VALIDATION_ERROR,
                `Missing/Invalid roles array in "${this.constructor.name}"`
            );
        }

        this._roles = roles;
        this._cache = {};
        // Cache roles by name
        this._roles.forEach((role: Role) => {
            // this.validateGrant(grant, true);
            this._cache[role.name] = role;
        });
    }

    getRoles(): Array<Role> {
        return this._roles;
    }

    getRolesByName(names: Array<string>): Array<Role> {
        const result: Array<Role> = [];

        if (names == null) {
            throw new ErrorEx(
                ErrorEx.VALIDATION_ERROR,
                `Roles names array can not be null or undefined`
            );
        }

        for (let i = 0; i < names.length; i += 1) {
            if (this._cache[names[i]] != null) {
                result.push(this._cache[names[i]]);
            }
        }

        return result;
    }
}
