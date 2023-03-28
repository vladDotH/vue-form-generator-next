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
import { useField } from "../use-field";
import { vAttributes } from "../v-attributes";
import {
  FieldProps,
  FieldEmits,
  FieldPropsObject,
  FieldEmitsObject,
  FieldExpose
} from "../fields";

const rawProps = defineProps(FieldPropsObject);
const props = rawProps as FieldProps;

const rawEmits = defineEmits(FieldEmitsObject);
const emits = rawEmits as FieldEmits;

const { getFieldID, clearValidationErrors, validate, value } = useField(
  props,
  emits
);

defineExpose<FieldExpose>({ validate, clearValidationErrors });
</script>

<style lang="scss"></style>
