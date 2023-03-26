import {
  forEach,
  get as objGet,
  isArray,
  isFunction,
  isNil,
  isString
} from "lodash";
import { getCurrentInstance, Ref } from "vue";
import { FormOptions } from "./fields/fields";

// TODO: drop context binding to disabled, readonly, featured, required
export const useForm = (
  errors: Ref<any[]>,
  model: Ref<any>,
  options: Ref<FormOptions>
) => {
  const instance = getCurrentInstance();

  const getFieldRowClasses = (field) => {
    const hasErrors = fieldErrors(field).length > 0;
    const baseClasses = {
      [objGet(options.value, "validationErrorClass", "error")]: hasErrors,
      [objGet(options.value, "validationSuccessClass", "valid")]: !hasErrors,
      disabled: fieldDisabled(field),
      readonly: fieldReadonly(field),
      featured: fieldFeatured(field),
      required: fieldRequired(field)
    };

    if (isArray(field.styleClasses)) {
      forEach(field.styleClasses, (c) => (baseClasses[c] = true));
    } else if (isString(field.styleClasses)) {
      baseClasses[field.styleClasses] = true;
    }

    if (!isNil(field.type)) {
      baseClasses["field-" + field.type] = true;
    }

    return baseClasses;
  };

  const fieldErrors = (field) => {
    const res = errors.value.filter((e) => e.field === field);
    return res.map((item) => item.error);
  };

  // Get disabled attr of field
  const fieldDisabled = (field) => {
    if (isFunction(field.disabled))
      return field.disabled.call(instance, model.value, field, instance);

    if (isNil(field.disabled)) return false;

    return field.disabled;
  };

  // Get readonly prop of field
  const fieldReadonly = (field) => {
    if (isFunction(field.readonly))
      return field.readonly.call(instance, model.value, field, instance);

    if (isNil(field.readonly)) return false;

    return field.readonly;
  };

  // Get featured prop of field
  const fieldFeatured = (field) => {
    if (isFunction(field.featured))
      return field.featured.call(instance, model.value, field, instance);

    if (isNil(field.featured)) return false;

    return field.featured;
  };

  // Get required prop of field
  const fieldRequired = (field) => {
    if (isFunction(field.required))
      return field.required.call(instance, model.value, field, instance);

    if (isNil(field.required)) return false;

    return field.required;
  };
};
