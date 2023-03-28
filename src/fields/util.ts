import { isString } from "lodash";
import validators from "../utils/validators";

export function convertValidator(validator: string | CallableFunction) {
  if (isString(validator)) {
    if (validators[validator] != null) {
      return validators[validator];
    } else {
      console.warn(`'${validator}' is not a validator function!`);
      return null; // caller need to handle null
    }
  }
  return validator;
}
