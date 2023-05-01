<template>
  <span
    :id="getFieldID(props.schema)"
    v-attributes="'label'"
    :class="props.schema.fieldClasses"
  >
    {{ value }}
  </span>
</template>

<script setup lang="ts">
import { useField } from "../use-field";
import { FieldPropsObject, FieldEmitsObject, FieldExpose } from "../fields";

const props = defineProps(FieldPropsObject);
const emit = defineEmits(FieldEmitsObject);

const { getFieldID, clearValidationErrors, validate, value } = useField(
  props,
  emit
);

defineExpose<FieldExpose>({ validate, clearValidationErrors });
</script>

<style lang="scss">
.vue-form-generator .field-label span {
  display: block;
  width: 100%;
  margin-left: 12px;
}
</style>
