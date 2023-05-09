<template>
  <div class="form-group" :class="getFieldRowClasses(props.field)">
    <label
      v-if="fieldTypeHasLabel(props.field)"
      :for="getFieldID(props.field)"
      :class="props.field.labelClasses"
    >
      <span v-html="props.field.label"></span>
      <span v-if="props.field.help" class="help">
        <i class="icon"></i>
        <div class="helpText" v-html="props.field.help"></div>
      </span>
    </label>

    <div class="field-wrap">
      <component
        :is="getFieldType(props.field)"
        ref="child"
        :vfg="props.vfg"
        :disabled="fieldDisabled(props.field)"
        :model="props.model"
        :schema="props.field"
        :form-options="props.options"
        @model-updated="onModelUpdated"
        @validated="onFieldValidated"
      />
      <div v-if="buttonVisibility(props.field)" class="buttons">
        <button
          v-for="(btn, index) in props.field.buttons"
          :key="index"
          :class="btn.classes"
          :type="getButtonType(btn)"
          @click="buttonClickHandler(btn, props.field, $event)"
          v-text="btn.label"
        ></button>
      </div>
    </div>

    <div
      v-if="props.field.hint"
      class="hint"
      v-html="fieldHint(props.field)"
    ></div>

    <div v-if="fieldErrors(props.field).length > 0" class="errors help-block">
      <span
        v-for="(error, index) in fieldErrors(props.field)"
        :key="index"
        v-html="error"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import fieldComponents from "./utils/fieldsLoader.js";
export default {
  components: fieldComponents
};
</script>

<script setup lang="ts">
import { isNil, isFunction } from "lodash";
import { slugifyFormID } from "./utils/schema.js";
import {
  FieldEmits,
  FieldEmitsObject,
  FieldExpose,
  FieldSchema,
  FormButton
} from "./fields/fields";
import { WrapperProps, WrapperPropsObject } from "./form";
import { useForm } from "./use-form";
import { getCurrentInstance, ref, toRef } from "vue";

const rawProps = defineProps(WrapperPropsObject);
const props = rawProps as WrapperProps;

const rawEmits = defineEmits(FieldEmitsObject);
const emit = rawEmits as FieldEmits;

const child = ref<FieldExpose>();

// TODO remove instances
const instance = getCurrentInstance();

const {
  getFieldRowClasses,
  fieldErrors,
  fieldDisabled,
  fieldReadonly,
  fieldFeatured,
  fieldRequired
} = useForm(
  toRef(props, "errors"),
  toRef(props, "model"),
  toRef(props, "options")
);

// Should field type have a label?
function fieldTypeHasLabel(field: FieldSchema) {
  if (isNil(field.label)) return false;

  let relevantType = "";
  if (field.type === "input") {
    relevantType = field.inputType;
  } else {
    relevantType = field.type;
  }

  switch (relevantType) {
    case "button":
    case "submit":
    case "reset":
      return false;
    default:
      return true;
  }
}

function getFieldID(schema: FieldSchema) {
  const idPrefix = props.options.fieldIdPrefix ?? "";
  return slugifyFormID(schema, idPrefix);
}

// Get type of field 'field-xxx'. It'll be the name of HTML element
function getFieldType(fieldSchema) {
  return "Field-" + fieldSchema.type;
}

// Get type of button, default to 'button'
function getButtonType(btn) {
  return btn.type ?? "button";
}

// Child field executed validation
function onFieldValidated(res: any, errors: any[], schema: any) {
  emit("validated", res, errors, schema);
}

function buttonVisibility(field: FieldSchema) {
  return field.buttons && field.buttons.length > 0;
}

function buttonClickHandler(btn: FormButton, field: FieldSchema, event: any) {
  return btn.onclick.call(instance, props.model, field, event, instance);
}

// Get current hint.
function fieldHint(field: FieldSchema) {
  if (isFunction(field.hint))
    return field.hint.call(instance, props.model, field, instance);

  return field.hint;
}

function onModelUpdated(newVal: any, schema: FieldSchema) {
  emit("model-updated", newVal, schema);
}

function validate(calledParent: any) {
  return child.value?.validate?.(calledParent);
}

function clearValidationErrors() {
  return child.value?.clearValidationErrors();
}

defineExpose<FieldExpose>({ validate, clearValidationErrors });
</script>

<style lang="scss">
$errorColor: #f00;
.form-group:not([class*=" col-"]) {
  width: 100%;
}
.form-group {
  display: inline-block;
  vertical-align: top;
  // width: 100%;
  // margin: 0.5rem 0.26rem;
  margin-bottom: 1rem;

  label {
    font-weight: 400;
    & > :first-child {
      display: inline-block;
    }
  }

  &.featured {
    > label {
      font-weight: bold;
    }
  }

  &.required {
    > label:after {
      content: "*";
      font-weight: normal;
      color: Red;
      // position: absolute;
      padding-left: 0.2em;
      font-size: 1em;
    }
  }

  &.disabled {
    > label {
      color: #666;
      font-style: italic;
    }
  }

  &.error {
    input:not([type="checkbox"]),
    textarea,
    select {
      border: 1px solid $errorColor;
      background-color: rgba($errorColor, 0.15);
    }

    .errors {
      color: $errorColor;
      font-size: 0.8em;
      span {
        display: block;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiklEQVR4Xt2TMQoCQQxF3xdhu72MpZU3GU/meBFLOztPYrVWsQmEWSaMsIXgK8P8RyYkMjO2sAN+K9gTIAmDAlzoUzE7p4IFytvDCQWJKSStYB2efcAvqZFM0BcstMx5naSDYFzfLhh/4SmRM+6Agw/xIX0tKEDFufeDNRUc4XqLRz3qabVIf3BMHwl6Ktexn3nmAAAAAElFTkSuQmCC");
        background-repeat: no-repeat;
        padding-left: 17px;
        padding-top: 0px;
        margin-top: 0.2em;
        font-weight: 600;
      }
    }
  }
}
</style>
