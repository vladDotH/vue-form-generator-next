import {
  debounce,
  forEach,
  get,
  isArray,
  isFunction,
  isString,
  uniqueId,
  uniq
} from "lodash";
import {
  ComponentInternalInstance,
  computed,
  getCurrentInstance,
  ref,
  unref
} from "vue";
import { FieldEmits, FieldProps, FieldSchema } from "./fields";
import { slugifyFormID } from "../utils/schema";
import { convertValidator } from "./util";

// TODO: drop context binding to onValidated, validators & inside emit('validated')
export const useField = (props: FieldProps, emit: FieldEmits) => {
  const instance = getCurrentInstance() as ComponentInternalInstance;

  const errors = ref<any[]>([]),
    debouncedValidateFunc = ref<any>(null),
    debouncedFormatFunc = ref<any>(null);

  const getFieldClasses = () => props.schema.fieldClasses ?? [],
    formatValueToField = ref((value: any) => value),
    formatValueToModel = ref((value: any) => value);

  const getFieldID = (schema: FieldSchema, unique = false) => {
    const idPrefix = props.formOptions?.fieldIdPrefix ?? "";
    return slugifyFormID(schema, idPrefix) + (unique ? "-" + uniqueId() : "");
  };

  const clearValidationErrors = () => errors.value.splice(0) as any[];

  const validate = (calledParent?: boolean) => {
    clearValidationErrors();
    const validateAsync = props.formOptions?.validateAsync ?? false;
    const validateDisabled = props.formOptions?.validateDisabled ?? false;
    const validateReadonly = props.formOptions?.validateReadonly ?? false;
    let results: any[] = [];

    if (
      props.schema.validator &&
      (props.schema.readonly !== true || validateReadonly) &&
      (props.disabled !== true || validateDisabled)
    ) {
      const validators = [];
      if (!isArray(props.schema.validator)) {
        const converted = convertValidator(props.schema.validator);
        if (converted) validators.push(converted.bind(instance));
      } else {
        forEach(props.schema.validator, (validator) => {
          const converted = convertValidator(validator);
          if (converted) validators.push(converted.bind(instance));
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
              emit("validated", isValid, errors.value, unref(props.schema));
            });
          } else if (result) {
            results = results.concat(result);
          }
        }
      });
    }

    const handleErrors = (errorsHandled: any[]) => {
      let fieldErrors: any[] = [];
      forEach(uniq(errorsHandled), (err) => {
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
        emit("validated", isValid, fieldErrors, unref(props.schema));
      }
      errors.value = fieldErrors;
      return fieldErrors;
    };

    if (!validateAsync) {
      return { res: handleErrors(results), schema: unref(props.schema) };
    }

    return {
      res: Promise.all(results).then(handleErrors),
      schema: unref(props.schema)
    };
  };

  const debouncedValidate = () => {
    if (!isFunction(debouncedValidateFunc.value)) {
      debouncedValidateFunc.value = debounce(
        validate,
        props.schema.validateDebounceTime ??
          props.formOptions?.validateDebounceTime ??
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

      if (get(props.formOptions, "validateAfterChanged", false) === true) {
        if (
          get(
            props.schema,
            "validateDebounceTime",
            get(props.formOptions, "validateDebounceTime", 0)
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
        val = get(props.model, props.schema.model);
      }

      return formatValueToField.value(val);
    },
    set: (newValue) => {
      const oldValue = value.value;
      newValue = formatValueToModel.value(newValue);

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
