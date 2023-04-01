<template>
  <input
    :id="getFieldID(props.schema)"
    v-model="value"
    v-attributes="'input'"
    type="checkbox"
    :autocomplete="props.schema.autocomplete"
    :disabled="props.disabled"
    :name="props.schema.inputName"
    :class="props.schema.fieldClasses"
    :required="props.schema.required"
  />
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
.vue-form-generator .field-checkbox input {
  margin-left: 12px;
}
</style>
