<template>
  <div v-attributes="'wrapper'" class="wrapper">
    <input
      :id="getFieldID(props.schema)"
      v-attributes="'input'"
      class="form-control"
      type="file"
      :name="props.schema.inputName"
      :accept="props.schema.accept"
      :multiple="props.schema.multiple"
      :placeholder="props.schema.placeholder"
      :readonly="props.schema.readonly"
      :required="props.schema.required"
      :disabled="props.disabled"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { FieldEmitsObject, FieldExpose, FieldPropsObject } from "../fields";
import { isFunction } from "lodash";
import { useField } from "../use-field";
import { getCurrentInstance } from "vue";

const props = defineProps(FieldPropsObject);
const emit = defineEmits(FieldEmitsObject);

const { getFieldID, clearValidationErrors, validate, value } = useField(
  props,
  emit
);

defineExpose<FieldExpose>({ validate, clearValidationErrors });

function onChange($event: any) {
  if (isFunction(props.schema.onChanged)) {
    // Schema has defined onChange method.
    props.schema.onChanged.call(
      getCurrentInstance(),
      props.model,
      props.schema,
      $event,
      getCurrentInstance()
    );
  }
}
</script>

<style lang="scss">
.vue-form-generator .field-input {
  .wrapper {
    width: 100%;
  }
  .helper {
    margin: auto 0.5em;
  }
}
</style>
