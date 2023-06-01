import floppyFilter from "floppy-filter";
import { Tuple, Permission } from "../types";

export class Utils {
    static filter(permission: Permission, data: Tuple) {
        const { attributes } = permission;
        if (data != null) {
            return floppyFilter.filterAll(data, attributes);
        }

        return data;
    }
}
