import { FieldSchema, FormOptions, FormSchema } from "./fields/fields";
import { PropType } from "vue";

export interface FormProps {
  schema: FormSchema;
  model: any;
  options: FormOptions;
  multiple: boolean;
  isNewModel: boolean;
  tag: string;
}

export const FormPropsObject = {
  schema: Object as PropType<FormSchema>,
  model: Object,
  options: {
    type: Object as PropType<FormOptions>,
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
