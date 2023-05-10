<template>
  <div v-if="props.schema != null" class="vue-form-generator">
    <component :is="props.tag" v-if="props.schema.fields">
      <template v-for="field in fields">
        <FormWrapper
          v-if="fieldVisible(field)"
          :ref="addChildRef"
          :vfg="instance"
          :field="field"
          :errors="errors"
          :model="props.model"
          :options="props.options"
          @validated="onFieldValidated"
          @model-updated="onModelUpdated"
        />
      </template>
    </component>
    <template v-for="group in groups">
      <component :is="props.tag" :class="getFieldRowClasses(group)">
        <legend v-if="group.legend">{{ group.legend }}</legend>
        <template v-for="field in group.fields">
          <FormWrapper
            v-if="fieldVisible(field)"
            :ref="addChildRef"
            :vfg="instance"
            :field="field"
            :errors="errors"
            :model="model"
            :options="options"
            @validated="onFieldValidated"
            @model-updated="onModelUpdated"
          />
        </template>
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import _, { get as objGet, forEach, isFunction, isNil, isArray } from "lodash";
import {
  FormExpose,
  FormProps,
  FormPropsObject,
  WrapperProps,
  WrapperPropsObject
} from "./form";
import {
  FieldEmits,
  FieldEmitsObject,
  FieldExpose,
  FieldSchema,
  FormSchema
} from "./fields/fields";
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  toRef,
  unref,
  watch
} from "vue";
import { useForm } from "./use-form";
import FormWrapper from "./FormWrapper.vue";

const rawProps = defineProps(FormPropsObject);
const props = rawProps as FormProps;

const rawEmits = defineEmits(FieldEmitsObject);
const emit = rawEmits as FieldEmits;

const children = ref<FieldExpose[]>([]);
const addChildRef = (el: FieldExpose) => children.value.push(el);

// TODO remove instances
const instance = getCurrentInstance();
const errors = ref<any[]>([]);

const {
  getFieldRowClasses,
  fieldErrors,
  fieldDisabled,
  fieldReadonly,
  fieldFeatured,
  fieldRequired
} = useForm(errors, toRef(props, "model"), toRef(props, "options"));

const fields = computed(() =>
  (props.schema?.fields ?? []).filter(
    (field) => !props.multiple || field.multi === true
  )
);
const groups = computed(() => props.schema?.groups ?? []);

watch(
  () => props.model,
  (newModel: any, oldModel: any) => {
    // model property changed, skip
    if (oldModel === newModel) return;

    // Model changed!
    if (newModel != null) {
      nextTick(() => {
        if (
          props.options.validateAfterLoad === true &&
          props.isNewModel !== true
        ) {
          validate();
        } else {
          clearValidationErrors();
        }
      });
    }
  }
);

onMounted(() => {
  nextTick(() => {
    if (props.model) {
      // First load, running validation if neccessary
      if (
        props.options.validateAfterLoad === true &&
        props.isNewModel !== true
      ) {
        validate();
      } else {
        clearValidationErrors();
      }
    }
  });
});

// Get visible prop of field
const fieldVisible = (field: FieldSchema) => {
  if (isFunction(field.visible))
    return field.visible.call(instance, props.model, field, instance);

  if (isNil(field.visible)) return true;

  return field.visible;
};

// Child field executed validation
const onFieldValidated = (res: any, fieldErrors: any, schema: any) => {
  // Remove old errors for this field
  errors.value = errors.value.filter((e) => !_.isEqual(unref(e.field), schema));

  if (!res && fieldErrors && fieldErrors.length > 0) {
    // Add errors with this field
    forEach(fieldErrors, (err) => {
      errors.value.push({
        field: schema,
        error: err
      });
    });
  }

  const isValid = errors.value.length === 0;
  emit("validated", isValid, errors.value, instance);
};

const onModelUpdated = (newVal: any, schema: FieldSchema) => {
  emit("model-updated", newVal, schema);
};

// Validating the model properties
const validate = (isAsync?: boolean) => {
  if (isAsync === undefined) {
    isAsync = objGet(props.options, "validateAsync", false);
  }
  clearValidationErrors();

  const fields = [];
  const results: any[] = [];

  forEach(children.value, (child: any) => {
    if (isFunction(child.validate)) {
      fields.push(child.$refs.child); // keep track of validated children
      results.push(child.validate(true));
    }
  });

  const handleErrors = (errors: any) => {
    const formErrors: any[] = [];
    forEach(errors, (err, i) => {
      if (isArray(err.res) && err.res.length > 0) {
        forEach(err.res, (error) => {
          formErrors.push({
            field: err.schema,
            error: error
          });
        });
      }
    });
    errors.value = formErrors;
    const isValid = formErrors.length === 0;
    emit("validated", isValid, formErrors, instance);
    return isAsync ? formErrors : isValid;
  };

  if (!isAsync) {
    return handleErrors(results);
  }

  return Promise.all(results).then(handleErrors);
};

// Clear validation errors
const clearValidationErrors = () => {
  errors.value.splice(0);

  forEach(children.value, (child) => {
    child.clearValidationErrors();
  });
};

defineExpose<FormExpose>({ errors, validate, clearValidationErrors });
</script>

<style lang="scss">
.vue-form-generator {
  * {
    box-sizing: border-box;
  }

  .form-control {
    // Default Bootstrap .form-control style
    display: block;
    &:not([class*=" col-"]) {
      width: 100%;
    }
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  } // .form-control

  span.help {
    margin-left: 0.3em;
    position: relative;

    .icon {
      display: inline-block;
      width: 16px;
      height: 14px;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAA+UlEQVQ4ja3TS0oDQRAG4C8+lq7ceICICoLGK7iXuNBbeAMJuPVOIm7cqmDiIncIggg+cMZFaqCnZyYKWtB0df31V1VXdfNH6S2wD9CP8xT3KH8T9BiTcE7XBMOfyBcogvCFO9ziLWwFRosyV+QxthNsA9dJkEYlvazsQdi3sBv6Ol6TBLX+HWT3fcQZ3vGM5fBLk+ynAU41m1biCXvhs4OPBDuBpa6GxF0P8YAj3GA1d1qJfdoS4DOIcIm1DK9x8iaWeDF/SP3QU6zRROpjLDFLsFlibx1jJaMkSIGrWKntvItcyTBKzCcybsvc9ZmYz3kz9Ooz/b98A8yvW13B3ch6AAAAAElFTkSuQmCC");
      background-repeat: no-repeat;
      background-position: center center;
    } // .icon

    .helpText {
      background-color: #444;
      bottom: 30px;
      color: #fff;
      display: block;
      left: 0px;
      //margin-bottom: 15px;
      opacity: 0;
      padding: 20px;
      pointer-events: none;
      position: absolute;
      text-align: justify;
      width: 300px;
      //transform: translateY(10%);
      transition: all 0.25s ease-out;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
      border-radius: 6px;

      a {
        font-weight: bold;
        text-decoration: underline;
      } // a
    } // .helpText

    /* This bridges the gap so you can mouse into the tooltip without it disappearing */
    .helpText:before {
      bottom: -20px;
      content: " ";
      display: block;
      height: 20px;
      left: 0;
      position: absolute;
      width: 100%;
    }

    &:hover .helpText {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0px);
    }
  } // span.help

  .field-wrap {
    display: flex;

    .buttons {
      white-space: nowrap;
      margin-left: 4px;
    }

    button,
    input[type="submit"] {
      // Default Bootstrap button style
      display: inline-block;
      padding: 6px 12px;
      margin: 0px;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.42857143;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      touch-action: manipulation;
      cursor: pointer;
      user-select: none;
      color: #333;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;

      &:not(:last-child) {
        margin-right: 4px;
      }

      &:hover {
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
      }

      &:active {
        color: #333;
        background-color: #d4d4d4;
        border-color: #8c8c8c;
        outline: 0;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    } // button, input[submit]
  } // .field-wrap

  .hint {
    font-style: italic;
    font-size: 0.8em;
  } // .hint
} // fieldset
</style>
