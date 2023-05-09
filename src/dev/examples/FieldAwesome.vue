<template>
  <input
    v-model="value"
    class="form-control"
    type="text"
    :maxlength="props.schema.max"
    :readonly="props.schema.readonly"
    :disabled="props.disabled"
    :placeholder="props.schema.placeholder"
  />
</template>

<script setup lang="ts">
import { useField } from "@/fields/use-field";
import {
  FieldPropsObject,
  FieldEmitsObject,
  FieldExpose
} from "@/fields/fields";

const props = defineProps(FieldPropsObject);
const emit = defineEmits(FieldEmitsObject);

const { getFieldID, clearValidationErrors, validate, value } = useField(
  props,
  emit
);

defineExpose<FieldExpose>({ validate, clearValidationErrors });
</script>

<style lang="scss" scoped>
input {
  background-color: lighten(blue, 40%) !important;
  font-weight: bold;
}
</style>
