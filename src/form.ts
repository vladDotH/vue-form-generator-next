import { FieldSchema, FormOptions } from "./fields/fields";

export interface WrapperProps<M = any> {
  vfg: any;
  model: M;
  options: FormOptions;
  field: FieldSchema;
  errors: any[];
}

export const WrapperPropsObject = {
  vfg: {
    type: Object,
    required: true
  },
  model: Object,
  options: {
    type: Object
  },
  field: {
    type: Object,
    required: true
  },
  errors: {
    type: Array,
    default: () => []
  }
};
