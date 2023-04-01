<template>
  <input
    :id="getFieldID(props.schema)"
    v-attributes="'input'"
    type="submit"
    :value="props.schema.buttonText"
    :name="props.schema.inputName"
    :disabled="props.disabled"
    :class="props.schema.fieldClasses"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { useField } from "../use-field";
import { FieldPropsObject, FieldEmitsObject, FieldExpose } from "../fields";
import { get, isEmpty, isFunction } from "lodash";

const props = defineProps(FieldPropsObject);
const emit = defineEmits(FieldEmitsObject);

const { getFieldID, clearValidationErrors, validate, value } = useField(
  props,
  emit
);

const onClick = ($event: Event) => {
  if (props.schema.validateBeforeSubmit === true) {
    // prevent a <form /> from having it's submit event triggered
    // when we have to validate data first
    $event.preventDefault();
    const validateAsync = get(props.formOptions, "validateAsync", false);
    const errors = props.vfg.validate();
    const handleErrors = (errors) => {
      if ((validateAsync && !isEmpty(errors)) || (!validateAsync && !errors)) {
        if (isFunction(props.schema.onValidationError)) {
          props.schema.onValidationError(
            props.model,
            props.schema,
            errors,
            $event
          );
        }
      } else if (isFunction(props.schema.onSubmit)) {
        props.schema.onSubmit(props.model, props.schema, $event);
      }
    };

    if (errors && isFunction(errors.then)) {
      errors.then(handleErrors);
    } else {
      handleErrors(errors);
    }
  } else if (isFunction(props.schema.onSubmit)) {
    // if we aren't validating, just pass the onSubmit handler the $event
    // so it can be handled there
    props.schema.onSubmit(props.model, props.schema, $event);
  }
};

defineExpose<FieldExpose>({ validate, clearValidationErrors });
</script>

<style lang="scss">
.vue-form-generator .field-submit input {
  // Default bootstrap primary button style
  color: #fff !important;
  background-color: #337ab7 !important;
  border-color: #2e6da4 !important;
}
</style>
