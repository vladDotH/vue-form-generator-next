import FormWrapper from "../FormWrapper.vue";
import {
  Component,
  ComponentInternalInstance,
  ExtractPropTypes,
  PropType
} from "vue";

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
  [key: string]: any;
}

export type FieldSchemaCallBack<T, M = any> = (
  model: M,
  field: FieldSchema<M>,
  wrapper: typeof FormWrapper
) => T;

type Values<Type> = Type[keyof Type];

type InnerKeys<Prefix extends string, Type> =
  | Values<{
      [Key in Exclude<keyof Type, symbol>]: `${Prefix}.${Key}`;
    }>
  | Values<{
      [Key in Exclude<keyof Type, symbol>]: Type[Key] extends object
        ? InnerKeys<`${Prefix}.${Key}`, Type[Key]>
        : never;
    }>;

type ModelKeys<Type> =
  | keyof Type
  | Values<{
      [Key in Exclude<keyof Type, symbol>]: Type[Key] extends object
        ? Key extends string
          ? InnerKeys<Key, Type[Key]>
          : never
        : never;
    }>;

export interface FieldSchema<M = object, V = any> {
  // Core fields
  type?: string | Component;
  label?: string;
  model?: ModelKeys<M> | string;
  default?: any;
  id?: string;
  inputName?: string;
  inputType?: string;
  accept?: string;
  get?: (model: M) => V;
  set?: (model: M, value: V) => void;
  validator?: string | string[];
  onChanged?: (
    model: M,
    newVal: V,
    oldVal: V,
    field: FieldSchema<M, V>
  ) => void;
  onValidated?: (model: M, errors: any[], field: FieldSchema<M, V>) => void;
  validateDebounceTime?: number;
  required?: boolean | FieldSchemaCallBack<boolean>;
  readonly?: boolean | FieldSchemaCallBack<boolean>;
  disabled?: boolean | FieldSchemaCallBack<boolean>;
  featured?: boolean | FieldSchemaCallBack<boolean>;
  visible?: boolean;
  multi?: boolean;
  placeholder?: string;
  fieldClasses?: string;
  styleClasses?: string | string[];
  labelClasses?: string;
  help?: string;
  hint?: string;
  buttons?: FormButton[];
  attributes?: object;
  // Additional
  max?: number;
  min?: number;
  rows?: number;
  pattern?: string;
  format?: string;
  autocomplete?: string;
  validateBeforeSubmit?: boolean;
  onValidationError: (
    model: M,
    schema: FieldSchema<M, V>,
    errors: any[],
    event: Event
  ) => void;
  onSubmit: (model: M, schema: FieldSchema<M, V>, event: Event) => void;
  [key: string]: any;
}

export interface FieldGroup<M = object> {
  legend: string;
  fields: FieldSchema<M>[];
  [key: string]: any;
}

export interface FormSchema<M = object> {
  fields: FieldSchema<M>[];
  groups: FieldGroup<M>[];
  [key: string]: any;
}

export const FieldPropsObject = {
  vfg: { type: Object as PropType<any> },
  model: Object as PropType<any>,
  schema: { type: Object as PropType<FieldSchema>, required: true },
  formOptions: Object as PropType<FormOptions>,
  disabled: Boolean as PropType<boolean>
} as const;

export type FieldProps = ExtractPropTypes<typeof FieldPropsObject>;

export const FieldEmitsObject = {
  validated(
    isValid: boolean,
    errors: any[],
    instance: ComponentInternalInstance
  ) {
    return true;
  },
  "model-updated": function (newValue: any, model: string) {
    return true;
  }
} as const;

export type FieldEmits = {
  (
    event: "validated",
    isValid: boolean,
    errors: any[],
    instance: ComponentInternalInstance
  ): void;
  (event: "model-updated", value: any, model: string): void;
};

export interface FieldExpose {
  validate: (calledParent?: any) => Promise<any[]> | any[];
  clearValidationErrors: () => any[];
}
