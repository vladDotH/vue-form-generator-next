<template>
  <textarea
    :id="getFieldID(props.schema)"
    v-model="value"
    v-attributes="'input'"
    class="form-control"
    :class="props.schema.fieldClasses"
    :disabled="props.disabled"
    :maxlength="props.schema.max"
    :minlength="props.schema.min"
    :placeholder="props.schema.placeholder"
    :readonly="props.schema.readonly"
    :required="props.schema.required"
    :rows="props.schema.rows || 2"
    :name="props.schema.inputName"
  />
</template>

<script setup lang="ts">
import { vAttributes, useField } from "../use-field";
import { defineProps, defineEmits } from "vue";
import {
  FieldProps,
  FieldEmits,
  FieldPropsObject,
  FieldEmitsObject
} from "../fields";

const props = defineProps(FieldPropsObject);
const emits = defineEmits(FieldEmitsObject);

const { getFieldID, clearValidationErrors, validate, value } = useField(
  props as FieldProps,
  emits as FieldEmits
);

defineExpose({ validate, clearValidationErrors });
</script>

<style lang="scss"></style>
