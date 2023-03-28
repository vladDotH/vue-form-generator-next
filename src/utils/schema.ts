import {
  get,
  set,
  each,
  isObject,
  isArray,
  isFunction,
  cloneDeep,
  isString
} from "lodash";
import { FieldSchema, FormSchema } from "../fields/fields";

// Create a new model by schema default values
const createDefaultObject = (schema: FormSchema, obj: any = {}) => {
  each(schema.fields, (field: FieldSchema) => {
    if (isString(field.model))
      if (get(obj, field.model) === undefined && field.default !== undefined) {
        if (isFunction(field.default)) {
          set(obj, field.model, field.default(field, schema, obj));
        } else if (isObject(field.default) || isArray(field.default)) {
          set(obj, field.model, cloneDeep(field.default));
        } else set(obj, field.model, field.default);
      }
  });
  return obj;
};

// Get a new model which contains only properties of multi-edit fields
const getMultipleFields = (schema: FormSchema) => {
  const res: FieldSchema[] = [];
  each(schema.fields, (field) => {
    if (field.multi === true) res.push(field);
  });

  return res;
};

// Merge many models to one 'work model' by schema
const mergeMultiObjectFields = (schema: FormSchema, objs: any[]) => {
  const model = {};

  const fields = getMultipleFields(schema);

  each(fields, (field) => {
    let mergedValue: any;
    let notSet = true;
    const path = field.model;

    if (isString(path)) {
      each(objs, (obj) => {
        const v = get(obj, path);
        if (notSet) {
          mergedValue = v;
          notSet = false;
        } else if (mergedValue !== v) {
          mergedValue = undefined;
        }
      });

      set(model, path, mergedValue);
    }
  });

  return model;
};

const slugifyFormID = (schema: FieldSchema, prefix = "") => {
  // Try to get a reasonable default id from the schema,
  // then slugify it.
  if (typeof schema.id !== "undefined") {
    // If an ID's been explicitly set, use it unchanged
    return prefix + schema.id;
  } else {
    // Return the slugified version of either:
    return (
      prefix +
      (schema.inputName || schema.label || schema.model || "")
        // NB: This is a very simple, conservative, slugify function,
        // avoiding extra dependencies.
        .toString()
        .trim()
        .toLowerCase()
        // Spaces & underscores to dashes
        .replace(/ |_/g, "-")
        // Multiple dashes to one
        .replace(/-{2,}/g, "-")
        // Remove leading & trailing dashes
        .replace(/^-+|-+$/g, "")
        // Remove anything that isn't a (English/ASCII) letter, number or dash.
        .replace(/([^a-zA-Z0-9-]+)/g, "")
    );
  }
};

const slugify = (name = "") => {
  // Return the slugified version of either:
  return (
    name
      // NB: This is a very simple, conservative, slugify function,
      // avoiding extra dependencies.
      .toString()
      .trim()
      // .toLowerCase()
      // Spaces to dashes
      .replace(/ /g, "-")
      // Multiple dashes to one
      .replace(/-{2,}/g, "-")
      // Remove leading & trailing dashes
      .replace(/^-+|-+$/g, "")
      // Remove anything that isn't a (English/ASCII) letter, number or dash.
      .replace(/([^a-zA-Z0-9-_/./:]+)/g, "")
  );
};

export {
  createDefaultObject,
  getMultipleFields,
  mergeMultiObjectFields,
  slugifyFormID,
  slugify
};
