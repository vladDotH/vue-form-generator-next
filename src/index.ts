import component from "./FormGenerator.vue";
import * as schema from "./utils/schema";
import validators from "./utils/validators";
import fieldComponents from "./utils/fieldsLoader";
import abstractField from "./fields/abstractField";
import { FieldSchema } from "./fields/fields";

export type ValidatorFunction<M = any, V = any> = (
  value: V,
  field: FieldSchema<M, V>,
  model: M,
  messages?: Record<string, string>
) => any[];

export interface VFGPluginOptions {
  validators: {
    [key: string]: ValidatorFunction;
  };
}

const install = (Vue: any, options: VFGPluginOptions) => {
  Vue.component("VueFormGenerator", component);
  if (options && options.validators) {
    for (const key in options.validators) {
      // if ({}.hasOwnProperty.call(options.validators, key)) {
      validators[key] = options.validators[key];
      // }
    }
  }
};

export default {
  component,
  schema,
  validators,
  abstractField,
  fieldComponents,
  install
};
