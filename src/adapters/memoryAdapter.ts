import { BaseAdapter } from "./baseAdapter";
import { Role, ErrorEx } from "../types";

export class MemoryAdapter<
    R extends [string, string, string]
> extends BaseAdapter<R, Array<Role<R>>> {
    private _roles: Array<Role<R>>;
    private _cache: { [k: string]: Role<R> } = {};

    constructor(roles: Array<Role<R>>) {
        super("MemoryAdapter");
        this.setRoles(roles);
    }

    setRoles(roles: Array<Role<R>>): void {
        if (roles == null || !Array.isArray(roles) || roles.length === 0) {
            throw new ErrorEx(
                ErrorEx.VALIDATION_ERROR,
                `Missing/Invalid roles array in "${this.constructor.name}"`
            );
        }

        this._roles = roles;
        this._cache = {};
        // Cache roles by name
        this._roles.forEach((role: Role<R>) => {
            // this.validateGrant(grant, true);
            this._cache[role.name] = role;
        });
    }

    getRoles(): Array<Role<R>> {
        return this._roles;
    }

    getRolesByName(names: Array<Role<R>["name"]>): Array<Role<R>> {
        const result: Array<Role<R>> = [];

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
