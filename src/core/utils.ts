import * as _ from "lodash";
import sift from "sift";
import floppyFilter from "floppy-filter";
import { ErrorEx, Tuple, Permission } from "../types";

const SUBJECT_PREFIX = "subject.";
const OBJECT_PREFIX = "resource.";

export class Utils {
    /**
     * Check for prefix ["subject", "resource"] within string and substitute it
     * with the actual value from data object
     * @param param String to resolve Ex. "subject.address.city"
     * @param {Tuple} subject Subject data
     * @param {Tuple} resource  Resource data
     * @returns {any}
     */
    private static resolveConditionParam(
        param: any,
        subject: Tuple,
        resource: Tuple
    ) {
        let path, data;
        if (param !== null && _.isString(param) && param.length > 0) {
            if (param.indexOf(SUBJECT_PREFIX) === 0) {
                path = param.substr(SUBJECT_PREFIX.length);
                data = subject;
            }
            if (param.indexOf(OBJECT_PREFIX) === 0) {
                path = param.substr(OBJECT_PREFIX.length);
                data = resource;
            }

            if (data != null) {
                return _.get(data, path);
            }
        }

        return param;
    }

    /**
     * Parse and substitute attribute values which starts with
     * ["subject", "resource"] prefixes with actual values
     * from "subject" or "object" data (It will not resolve keys)
     *
     * Ex. object:
     * {
     *   "subject.id": {"$eq": "object.userId"}
     * }
     *
     * Only "object.userId" will be substituted
     * @param condition
     * @param subject
     * @param resource
     * @returns object
     */
    private static parseCondition(
        condition: Tuple,
        subject: Tuple,
        resource: Tuple
    ) {
        let result: { [k: string]: any } = {};

        if (_.isString(condition)) {
            result = this.resolveConditionParam(condition, subject, resource);
        } else if (
            _.isDate(condition) ||
            _.isArray(condition) ||
            _.isFunction(condition) ||
            _.isRegExp(condition)
        ) {
            result = condition;
        } else if (_.isObject(condition)) {
            Object.entries(condition).forEach(([key, value]) => {
                result[key] = this.parseCondition(value, subject, resource);
            });
        } else {
            result = condition;
        }

        return result;
    }

    /**
     * check if permission allows subject (like user) to access resource,
     * role conditions will be evaluated for this check
     * @param permission Permission object
     * @param {Tuple} subject User object
     * @param {Tuple} resource Resource object
     * @returns {boolean}
     */
    static canSubjectAccessResource(
        permission: Permission,
        subject: Tuple,
        resource: Tuple
    ): boolean {
        let accessGranted = false;
        const { granted, conditions } = permission;

        if (granted === true) {
            if (conditions == null || conditions.length === 0) {
                return true;
            }

            for (let i = 0; i < conditions.length; i += 1) {
                const condition = conditions[i];
                try {
                    if (!_.isObject(condition)) {
                        throw new ErrorEx(
                            ErrorEx.VALIDATION_ERROR,
                            "Condition must be an object"
                        );
                    }

                    const [[key, query]] = Object.entries(condition);
                    const pKey = this.resolveConditionParam(
                        key,
                        subject,
                        resource
                    );
                    const pQuery = this.parseCondition(
                        query,
                        subject,
                        resource
                    );
                    accessGranted = sift(pQuery).call(this, pKey);

                    if (!accessGranted) {
                        break;
                    }
                } catch (e) {
                    return false;
                }
            }
        }

        return accessGranted;
    }

    static filter(permission: Permission, data: Tuple) {
        const { attributes } = permission;
        if (data != null) {
            return floppyFilter.filterAll(data, attributes);
        }

        return data;
    }
}
