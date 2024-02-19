import { Role } from "../types";

/**
 * Base Adapter Class
 * @class
 * @typeParam T - Type of getRolesByName return, can be Array<Role> | Promise<Array<Role>>
 */
export abstract class BaseAdapter<
    T extends Array<Role> | Promise<Array<Role>>
> {
    protected constructor(public name: string) {}

    /**
     * @method getRolesByName
     * @template T - Type of return defined on extending the class, can be Array<Role> | Promise<Array<Role>>
     * @param {Array<string>} names - Roles names
     * @returns {T}
     */
    abstract getRolesByName(names: Array<string>): T;
}
