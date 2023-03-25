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

export interface FieldSchema<M = any, V = any> {
  type?: string;
  label?: string;
  model?: string;
  id?: string;
  inputName?: string;
  inputType?: string;
  fieldClasses?: string;
  readonly?: boolean;
  accept?: string;
  get?: (model: M) => V;
  set?: (model: M, value: V) => void;
  onChanged: (model: M, newVal: V, oldVal: V, field: FieldSchema<M, V>) => void;
  validator: string | string[];
  onValidated: (model: M, errors: any[], field: FieldSchema<M, V>) => void;
}

export interface FieldGroup<M = any> {
  legend: string;
  fields: FieldSchema<M>[];
}

export interface FormSchema {
  fields: FieldSchema[];
  groups: FieldGroup[];
}

export interface FieldProps {
  vfg: any;
  model: any;
  schema: FieldSchema;
  formOptions: FormOptions;
  disabled: boolean;
}

export interface FieldPropsWrap {
  vfgProps: FieldProps;
}

export const FieldPropsObject = {
  vfg: {} as any,
  model: {} as any,
  schema: {} as FieldSchema,
  formOptions: {} as FormOptions,
  disabled: Boolean
};

export interface FieldEmits {
  (e: "validated", isValid: boolean, errors: any[], vfg: any): void;
  (e: "model-updated", value: any, model: string): void;
}
