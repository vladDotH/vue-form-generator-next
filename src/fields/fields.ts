import FormWrapper from "../FormWrapper.vue";
import { ComponentPublicInstance, PropType } from "vue";

export interface FormOptions {
  validateAfterLoad: boolean;
  validateAfterChanged: boolean;
  validateDisabled: boolean;
  validateReadonly: boolean;
  fieldIdPrefix: string;
  validateAsync: boolean;
  validationErrorClass: string;
  validationSuccessClass: string;
  validateDebounceTime: number;
}

export interface FormButton {
  classes?: string;
  label?: string;
  type?: string;
  onclick: (
    model: any,
    field: FieldSchema,
    event: any,
    wrapper: typeof FormWrapper
  ) => void;
}

export type FieldSchemaCallBack<T, M = any> = (
  model: M,
  field: FieldSchema<M>,
  wrapper: typeof FormWrapper
) => T;

export interface FieldSchema<M = any, V = any> {
  type?: string;
  label?: string;
  model?: string;
  default?: any;
  id?: string;
  inputName?: string;
  inputType?: string;
  fieldClasses?: string;
  accept?: string;
  get?: (model: M) => V;
  set?: (model: M, value: V) => void;
  validator: string | string[];
  onChanged: (model: M, newVal: V, oldVal: V, field: FieldSchema<M, V>) => void;
  onValidated: (model: M, errors: any[], field: FieldSchema<M, V>) => void;
  validateDebounceTime?: number;
  max?: number;
  min?: number;
  placeholder?: string;
  rows?: number;
  styleClasses?: string | string[];
  labelClasses?: string;
  help?: string;
  hint?: string;
  buttons?: FormButton[];
  required?: boolean | FieldSchemaCallBack<boolean>;
  readonly?: boolean | FieldSchemaCallBack<boolean>;
  disabled?: boolean | FieldSchemaCallBack<boolean>;
  featured?: boolean | FieldSchemaCallBack<boolean>;
  multi?: boolean;
  visible?: boolean;
  pattern?: string;
  attributes?: object;
}

export interface FieldGroup<M = any> {
  legend: string;
  fields: FieldSchema<M>[];
}

export interface FormSchema<M = any> {
  fields: FieldSchema<M>[];
  groups: FieldGroup<M>[];
}

export interface FieldProps {
  vfg: any;
  model: any;
  schema: FieldSchema;
  formOptions: FormOptions;
  disabled: boolean;
}

export const FieldPropsObject = {
  vfg: Object as PropType<any>,
  model: Object as PropType<any>,
  schema: Object as PropType<FieldSchema>,
  formOptions: Object as PropType<FormOptions>,
  disabled: Boolean as PropType<boolean>
};

export interface FieldEmits {
  (
    e: "validated",
    isValid: boolean,
    errors: any[],
    vfg: ComponentPublicInstance
  ): void;
  (e: "model-updated", value: any, model: string): void;
}

export const FieldEmitsObject = {
  validated(
    isValid: boolean,
    errors: any[],
    instance: ComponentPublicInstance
  ) {
    return true;
  },
  "model-updated": function (newValue: any, model: string) {
    return true;
  }
};

export interface FieldExpose {
  validate: (calledParent?: any) => Promise<any[]> | any[];
  clearValidationErrors: () => any[];
}
