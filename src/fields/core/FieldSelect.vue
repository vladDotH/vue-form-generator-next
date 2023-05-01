<template>
  <select
    :id="getFieldID(props.schema)"
    v-model="value"
    v-attributes="'input'"
    class="form-control"
    :disabled="props.disabled"
    :name="props.schema.inputName"
    :class="props.schema.fieldClasses"
  >
    <option
      v-if="!selectOptions.hideNoneSelectedText"
      :disabled="props.schema.required"
      :value="null"
    >
      {{ selectOptions.noneSelectedText || "&lt;Nothing selected&gt;" }}
    </option>
    <template v-for="item in items">
      <optgroup v-if="item.group" :label="getGroupName(item)">
        <option v-for="i in item.ops" v-if="item.ops" :value="getItemValue(i)">
          {{ getItemName(i) }}
        </option>
      </optgroup>
      <option v-if="!item.group" :value="getItemValue(item)">
        {{ getItemName(item) }}
      </option>
    </template>
  </select>
</template>

<script setup lang="ts">
import { isObject, isNil, find } from "lodash";
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

const selectOptions = computed(() => {
  return props.schema.selectOptions || {};
});

const items = computed(() => {
  const values = props.schema.values;
  if (typeof values == "function") {
    return groupValues(
      values.apply(getCurrentInstance(), [props.model, props.schema])
    );
  } else return groupValues(values);
});

formatValueToField.value = (value) => {
  if (isNil(value)) {
    return null;
  }
  return value;
};

function groupValues(values) {
  const array = [];
  let arrayElement: any = {};

  values.forEach((item) => {
    arrayElement = null;

    if (item.group && isObject(item)) {
      // There is in a group.

      // Find element with this group.
      arrayElement = find(array, (i) => i.group === item.group);

      if (arrayElement) {
        // There is such a group.

        arrayElement.ops.push({
          id: item.id,
          name: item.name
        });
      } else {
        // There is not such a group.

        // Initialising.
        arrayElement = {
          group: "",
          ops: []
        };

        // Set group.
        arrayElement.group = item.group;

        // Set Group element.
        arrayElement.ops.push({
          id: item.id,
          name: item.name
        });

        // Add array.
        array.push(arrayElement);
      }
    } else {
      // There is not in a group.
      array.push(item);
    }
  });

  // With Groups.
  return array;
}

function getGroupName(item) {
  if (item && item.group) {
    return item.group;
  }

  throw "Group name is missing! https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items";
}

function getItemValue(item) {
  if (isObject(item)) {
    if (
      typeof props.schema["selectOptions"] !== "undefined" &&
      typeof props.schema["selectOptions"]["value"] !== "undefined"
    ) {
      return item[props.schema.selectOptions.value];
    } else {
      // Use 'id' instead of 'value' cause of backward compatibility
      if (typeof item["id"] !== "undefined") {
        return item.id;
      } else {
        throw "`id` is not defined. If you want to use another key name, add a `value` property under `selectOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items";
      }
    }
  } else {
    return item;
  }
}

function getItemName(item) {
  if (isObject(item)) {
    if (
      typeof props.schema["selectOptions"] !== "undefined" &&
      typeof props.schema["selectOptions"]["name"] !== "undefined"
    ) {
      return item[props.schema.selectOptions.name];
    } else {
      if (typeof item["name"] !== "undefined") {
        return item.name;
      } else {
        throw "`name` is not defined. If you want to use another key name, add a `name` property under `selectOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items";
      }
    }
  } else {
    return item;
  }
}
</script>

<style lang="sass"></style>
