import FormWrapper from "../FormWrapper.vue";

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
    wrapper: FormWrapper
  ) => void;
}

export type FieldSchemaCallBack<T, M = any> = (
  model: M,
  field: FieldSchema<M>,
  wrapper: FormWrapper
) => T;

export interface FieldSchema<M = any, V = any> {
  type?: string;
  label?: string;
  model?: string;
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
  vfg: Object,
  model: Object,
  schema: Object,
  formOptions: Object,
  disabled: Boolean
};

export interface FieldEmits {
  (e: "validated", isValid: boolean, errors: any[], vfg: any): void;
  (e: "model-updated", value: any, model: any): void;
}

export const FieldEmitsObject = ["validated", "model-updated"];

export interface FieldExpose {
  validate: (calledParent?: any) => Promise<any[]> | any[];
  clearValidationErrors: () => any[];
}
