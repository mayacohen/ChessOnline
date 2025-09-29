import { IdentityError } from "./identity-error";
export interface IdentityResult {
    succeeded: boolean;
    errors: IdentityError[];
}
