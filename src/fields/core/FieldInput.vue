<template>
  <div v-attributes="'wrapper'" class="wrapper">
    <input
      :id="getFieldID(props.schema)"
      v-attributes="'input'"
      class="form-control"
      :type="inputType"
      :value="value"
      :class="props.schema.fieldClasses"
      :disabled="props.disabled"
      :accept="props.schema.accept"
      :alt="props.schema.alt"
      :autocomplete="props.schema.autocomplete"
      :checked="props.schema.checked"
      :dirname="props.schema.dirname"
      :formaction="props.schema.formaction"
      :formenctype="props.schema.formenctype"
      :formmethod="props.schema.formmethod"
      :formnovalidate="props.schema.formnovalidate"
      :formtarget="props.schema.formtarget"
      :height="props.schema.height"
      :list="props.schema.list"
      :max="props.schema.max"
      :maxlength="props.schema.maxlength"
      :min="props.schema.min"
      :minlength="props.schema.minlength"
      :multiple="props.schema.multiple"
      :name="props.schema.inputName"
      :pattern="props.schema.pattern"
      :placeholder="props.schema.placeholder"
      :readonly="props.schema.readonly"
      :required="props.schema.required"
      :size="props.schema.size"
      :src="props.schema.src"
      :step="props.schema.step"
      :width="props.schema.width"
      :files="props.schema.files"
      :dataCy="props.schema.dataCy"
      @input="onInput"
      @blur="onBlur"
      @change="props.schema.onChange || null"
    />
  </div>
  <span
    v-if="
      props.schema.inputType.toLowerCase() === 'color' ||
      props.schema.inputType.toLowerCase() === 'range'
    "
    class="helper"
  >
    {{ value }}
  </span>
</template>

<script setup lang="ts">
import { debounce, get, isFunction, isNumber } from "lodash";
import fecha from "fecha";

const DATETIME_FORMATS = {
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm:ss",
  "datetime-local": "YYYY-MM-DDTHH:mm:ss"
};

import { useField } from "../use-field";
import { vAttributes } from "../v-attributes";
import { FieldPropsObject, FieldEmitsObject, FieldExpose } from "../fields";
import { computed, onMounted } from "vue";

const props = defineProps(FieldPropsObject);
const emit = defineEmits(FieldEmitsObject);

if (props.schema.inputType.toLowerCase() === "file") {
  console.warn(
    "The 'file' type in input field is deprecated. Use 'file' field instead."
  );
}

const {
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
} = useField(props, emit);

defineExpose<FieldExpose>({ validate, clearValidationErrors });

const inputType = computed(() => {
  if (props.schema && props.schema.inputType === "datetime") {
    // convert "datetime" to "datetime-local" (datetime deprecated in favor of "datetime-local")
    // ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime
    return "datetime-local";
  }
  return props.schema.inputType;
});

onMounted(() => {
  switch (props.schema.inputType.toLowerCase()) {
    case "number":
    case "range":
      debouncedFormatFunc.value = debounce(
        (newValue, oldValue) => {
          formatNumberToModel(newValue, oldValue);
        },
        parseInt(get(props.schema, "debounceFormatTimeout", "1000")),
        {
          trailing: true,
          leading: false
        }
      );
      break;
    case "date":
    case "datetime":
    case "datetime-local":
      // wait 1s before calling 'formatDatetimeToModel' to allow user to input data
      debouncedFormatFunc.value = debounce(
        (newValue, oldValue) => {
          formatDatetimeToModel(newValue, oldValue);
        },
        parseInt(get(props.schema, "debounceFormatTimeout", "1000")),
        {
          trailing: true,
          leading: false
        }
      );
      break;
  }
});

formatValueToModel.value = (value) => {
  if (value != null) {
    switch (props.schema.inputType.toLowerCase()) {
      case "date":
      case "datetime":
      case "datetime-local":
      case "number":
      case "range":
        // debounce
        return (newValue, oldValue) => {
          debouncedFormatFunc(value, oldValue);
        };
    }
  }

  return value;
};

formatValueToField.value = (value) => {
  switch (props.schema.inputType.toLowerCase()) {
    case "date":
    case "datetime":
    case "datetime-local":
      return formatDatetimeValueToField(value);
  }
  return value;
};

const formatDatetimeToModel = (newValue, oldValue) => {
  const defaultFormat = DATETIME_FORMATS[props.schema.inputType.toLowerCase()];
  const m = fecha.parse(newValue, defaultFormat);
  if (m !== false) {
    if (props.schema.format) {
      newValue = fecha.format(m, props.schema.format);
    } else {
      newValue = m.valueOf();
    }
  }
  updateModelValue(newValue, oldValue);
};

const formatDatetimeValueToField = (value) => {
  if (value === null || undefined === value) {
    return null;
  }

  const defaultFormat = DATETIME_FORMATS[props.schema.inputType.toLowerCase()];
  let m = value;
  if (!isNumber(value)) {
    m = fecha.parse(value, defaultFormat);
  }
  if (m !== false) {
    return fecha.format(m, defaultFormat);
  }
  return value;
};

const formatNumberToModel = (newValue, oldValue) => {
  if (!isNumber(newValue)) {
    newValue = NaN;
  }
  updateModelValue(newValue, oldValue);
};

const onInput = ($event) => {
  let newVal = $event.target.value;
  switch (props.schema.inputType.toLowerCase()) {
    case "number":
    case "range":
      if (isNumber(parseFloat($event.target.value))) {
        newVal = parseFloat($event.target.value);
      }
      break;
  }
  value.value = newVal;
};

const onBlur = () => {
  if (isFunction(debouncedFormatFunc)) {
    debouncedFormatFunc.flush();
  }
};
</script>

<style lang="scss">
.vue-form-generator .field-input {
  .wrapper {
    width: 100%;
  }
  input[type="radio"] {
    width: 100%;
  }
  input[type="color"] {
    width: 60px;
  }
  input[type="range"] {
    padding: 0;
  }

  .helper {
    margin: auto 0.5em;
  }
}
</style>
