import { FieldSchema, FormOptions, FormSchema } from "./fields/fields";

export interface FormProps {
  schema: FormSchema;
  model: any;
  option: FormOptions;
  multiple: boolean;
  isNewModel: boolean;
  tag: string;
}

export const FormPropsObject = {
  schema: Object,
  model: Object,
  options: {
    type: Object,
    default() {
      return {
        validateAfterLoad: false,
        validateAfterChanged: false,
        validateDisabled: false,
        validateReadonly: false,
        fieldIdPrefix: "",
        validateAsync: false,
        validationErrorClass: "error",
        validationSuccessClass: ""
      };
    }
  },
  multiple: {
    type: Boolean,
    default: false
  },
  isNewModel: {
    type: Boolean,
    default: false
  },
  tag: {
    type: String,
    default: "fieldset",
    validator: (value: string) => value.length > 0
  }
};

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
