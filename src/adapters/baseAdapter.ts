import { Role } from "../types";

/**
 * Base Adapter Class
 * @class
 * @typeParam R = [RoleNameType, ResourceNameType, ActionNameType]
 * array of role names, resources names, and actions names
 * @typeParam T - Type of getRolesByName return, can be Array<Role> | Promise<Array<Role>>
 */
export abstract class BaseAdapter<
    R extends [string, string, string],
    T extends Array<Role<R>> | Promise<Array<Role<R>>>
> {
    protected constructor(public name: string) {}

    /**
     * @method getRolesByName
     * @template T - Type of return defined on extending the class, can be Array<Role> | Promise<Array<Role>>
     * @param {Array<string>} names - Roles names
     * @returns {T}
     */
    abstract getRolesByName(names: Array<R[0]>): T;
}
