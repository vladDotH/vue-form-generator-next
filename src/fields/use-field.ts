import {
  debounce,
  forEach,
  get as objGet,
  isArray,
  isFunction,
  isString,
  uniqueId,
  uniq as arrayUniq
} from "lodash";
import {
  computed,
  Directive,
  DirectiveBinding,
  getCurrentInstance,
  ref
} from "vue";
import { FieldEmits, FieldProps, FormSchema } from "./fields";
import validators from "../utils/validators";
import { slugifyFormID } from "../utils/schema";

// TODO validators types
function convertValidator(validator: string | CallableFunction) {
  if (isString(validator)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (validators[validator] != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return validators[validator];
    } else {
      console.warn(`'${validator}' is not a validator function!`);
      return null; // caller need to handle null
    }
  }
  return validator;
}

// TODO Vnode context type
function attributesDirective(
  el: Element,
  binding: DirectiveBinding,
  vnode: any
) {
  let attrs = vnode.context?.schema?.attributes ?? {};
  const container = binding.value || "input";
  if (isString(container)) {
    attrs = objGet(attrs, container) || attrs;
  }
  forEach(attrs, (val, key) => {
    el.setAttribute(key, val);
  });
}

export const vAttributes: Directive = {
  mounted: attributesDirective,
  updated: attributesDirective
};

export const useField = (props: FieldProps, emit: FieldEmits) => {
  const instance = getCurrentInstance();

  const errors = ref<any[]>([]),
    debouncedValidateFunc = ref<any>(null),
    debouncedFormatFunc = ref<any>(null);

  const getFieldClasses = () => props.schema.fieldClasses ?? [],
    formatValueToField = (value: any) => value,
    formatValueToModel = (value: any) => value;

  const getFieldID = (schema: FormSchema, unique = false) => {
    const idPrefix = props.formOptions.fieldIdPrefix ?? "";
    return slugifyFormID(schema, idPrefix) + (unique ? "-" + uniqueId() : "");
  };

  const clearValidationErrors = () => errors.value.splice(0);

  const validate = (calledParent?: boolean) => {
    clearValidationErrors();
    const validateAsync = props.formOptions.validateAsync ?? false;
    const validateDisabled = props.formOptions.validateDisabled ?? false;
    const validateReadonly = props.formOptions.validateReadonly ?? false;
    let results: any[] = [];

    if (
      props.schema.validator &&
      (props.schema.readonly !== true || validateReadonly) &&
      (props.disabled !== true || validateDisabled)
    ) {
      const validators = [];
      if (!isArray(props.schema.validator)) {
        validators.push(
          convertValidator(props.schema.validator).bind(instance)
        );
      } else {
        forEach(props.schema.validator, (validator) => {
          validators.push(convertValidator(validator).bind(instance));
        });
      }

      forEach(validators, (validator) => {
        if (validateAsync) {
          results.push(validator(value.value, props.schema, props.model));
        } else {
          const result = validator(value.value, props.schema, props.model);
          if (result && isFunction(result.then)) {
            result.then((err: any) => {
              if (err) {
                errors.value.push(...err);
              }
              const isValid = errors.value.length === 0;
              emit("validated", isValid, errors.value, instance);
            });
          } else if (result) {
            results = results.concat(result);
          }
        }
      });
    }

    const handleErrors = (errorsHandled: any[]) => {
      let fieldErrors: any[] = [];
      forEach(arrayUniq(errorsHandled), (err) => {
        if (isArray(err) && err.length > 0) {
          fieldErrors = fieldErrors.concat(err);
        } else if (isString(err)) {
          fieldErrors.push(err);
        }
      });
      if (isFunction(props.schema.onValidated)) {
        props.schema.onValidated.call(
          instance,
          props.model,
          fieldErrors,
          props.schema
        );
      }

      const isValid = fieldErrors.length === 0;
      if (!calledParent) {
        emit("validated", isValid, fieldErrors, instance);
      }
      errors.value = fieldErrors;
      return fieldErrors;
    };

    if (!validateAsync) {
      return handleErrors(results);
    }

    return Promise.all(results).then(handleErrors);
  };

  const debouncedValidate = () => {
    if (!isFunction(debouncedValidateFunc.value)) {
      debouncedValidateFunc.value = debounce(
        validate,
        props.schema.validateDebounceTime ??
          props.formOptions.validateDebounceTime ??
          500
      );
    }
    debouncedValidateFunc.value();
  };

  const setModelValueByPath = (model: any, path: string, value: any) => {
    // convert array indexes to properties
    let s = path.replace(/\[(\w+)\]/g, ".$1");
    // strip a leading dot
    s = s.replace(/^\./, "");

    const keys = s.split(".");
    let i = 0;
    const n = keys.length;
    while (i < n) {
      const key = keys[i];
      if (i < n - 1) {
        if (model[key] !== undefined) {
          // Found parent property. Step in
          model = model[key];
        } else {
          // Create missing property (new level)
          model[key] = {};
          model = model[key];
        }
      } else {
        // Set final property value
        model[key] = value;
        return;
      }
      ++i;
    }
  };

  const updateModelValue = (newValue: any, oldValue: any) => {
    let changed = false;
    if (isFunction(props.schema.set)) {
      props.schema.set(props.model, newValue);
      changed = true;
    } else if (props.schema.model) {
      setModelValueByPath(props.model, props.schema.model, newValue);
      changed = true;
    }

    if (changed) {
      emit("model-updated", newValue, props.schema.model);

      if (isFunction(props.schema.onChanged)) {
        props.schema.onChanged(props.model, newValue, oldValue, props.schema);
      }

      if (objGet(props.formOptions, "validateAfterChanged", false) === true) {
        if (
          objGet(
            props.schema,
            "validateDebounceTime",
            objGet(props.formOptions, "validateDebounceTime", 0)
          ) > 0
        ) {
          debouncedValidate();
        } else {
          validate();
        }
      }
    }
  };

  const value = computed({
    get: () => {
      let val;
      if (isFunction(props.schema.get)) {
        val = props.schema.get(props.model);
      } else if (props.schema.model) {
        val = objGet(props.model, props.schema.model);
      }

      return formatValueToField(val);
    },
    set: (newValue) => {
      const oldValue = value.value;
      newValue = formatValueToModel(newValue);

      if (isFunction(newValue)) {
        newValue(newValue, oldValue);
      } else {
        updateModelValue(newValue, oldValue);
      }
    }
  });

  return {
    errors,
    debouncedValidateFunc,
    debouncedFormatFunc,
    getFieldClasses,
    formatValueToField,
    formatValueToModel,
    getFieldID,
    clearValidationErrors,
    validate,
    debouncedValidate,
    setModelValueByPath,
    updateModelValue,
    value
  };
};
