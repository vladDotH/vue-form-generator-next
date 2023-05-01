<template>
  <div v-attributes="'wrapper'" class="radio-list" :disabled="disabled">
    <label
      v-for="item in items"
      v-attributes="'label'"
      :class="getItemCssClasses(item)"
      ><input
        :id="getFieldID(schema, true)"
        v-attributes="'input'"
        type="radio"
        :disabled="isItemDisabled(item)"
        :name="id"
        :value="getItemValue(item)"
        :checked="isItemChecked(item)"
        :class="schema.fieldClasses"
        :required="schema.required"
        @click="onSelection(item)"
      />{{ getItemName(item) }}</label
    >
  </div>
</template>

<script setup lang="ts">
import { isObject, isFunction, get as objGet } from "lodash";
import { FieldEmitsObject, FieldExpose, FieldPropsObject } from "../fields";
import { useField } from "../use-field";
import { computed, getCurrentInstance } from "vue";
const props = defineProps(FieldPropsObject);
const emit = defineEmits(FieldEmitsObject);

const {
  debouncedFormatFunc,
  formatValueToField,
  formatValueToModel,
  getFieldID,
  clearValidationErrors,
  validate,
  updateModelValue,
  value
} = useField(props, emit);

defineExpose<FieldExpose>({ validate, clearValidationErrors });

const items = computed(() => {
  const values = props.schema.values;
  if (typeof values == "function") {
    return values.apply(getCurrentInstance(), [props.model, props.schema]);
  } else {
    return values;
  }
});

const id = computed(() => {
  return props.schema.model;
});

function getItemValue(item) {
  if (isObject(item)) {
    if (
      typeof props.schema["radiosOptions"] !== "undefined" &&
      typeof props.schema["radiosOptions"]["value"] !== "undefined"
    ) {
      return item[props.schema.radiosOptions.value];
    } else {
      if (typeof item["value"] !== "undefined") {
        return item.value;
      } else {
        throw "`value` is not defined. If you want to use another key name, add a `value` property under `radiosOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/radios.html#radios-field-with-object-values";
      }
    }
  } else {
    return item;
  }
}

function getItemName(item) {
  if (isObject(item)) {
    if (
      typeof props.schema["radiosOptions"] !== "undefined" &&
      typeof props.schema["radiosOptions"]["name"] !== "undefined"
    ) {
      return item[props.schema.radiosOptions.name];
    } else {
      if (typeof item["name"] !== "undefined") {
        return item.name;
      } else {
        throw "`name` is not defined. If you want to use another key name, add a `name` property under `radiosOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/radios.html#radios-field-with-object-values";
      }
    }
  } else {
    return item;
  }
}

function getItemCssClasses(item) {
  return {
    "is-checked": isItemChecked(item),
    "is-disabled": isItemDisabled(item)
  };
}

function onSelection(item) {
  value.value = getItemValue(item);
}

function isItemChecked(item) {
  const currentValue = getItemValue(item);
  return currentValue === value.value;
}

function isItemDisabled(item) {
  if (props.disabled) {
    return true;
  }
  const disabled = objGet(item, "disabled", false);
  if (isFunction(disabled)) {
    return disabled(props.model);
  }
  return disabled;
}
</script>

<style lang="scss">
.vue-form-generator .field-radios {
  .radio-list {
    label {
      display: block;
      input[type="radio"] {
        margin-right: 5px;
      }
    }
  }
}
</style>
