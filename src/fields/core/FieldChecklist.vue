<template>
  <div v-attributes="'wrapper'" class="wrapper">
    <div
      v-if="props.schema.listBox"
      class="listbox form-control"
      :disabled="props.disabled"
    >
      <div
        v-for="item in items"
        class="list-row"
        :class="{ 'is-checked': isItemChecked(item) }"
      >
        <label>
          <input
            :id="getFieldID(props.schema, true)"
            v-attributes="'input'"
            type="checkbox"
            :checked="isItemChecked(item)"
            :disabled="props.disabled"
            :name="getInputName(item)"
            @change="onChanged($event, item)"
          />{{ getItemName(item) }}
        </label>
      </div>
    </div>
    <div
      v-if="!props.schema.listBox"
      class="combobox form-control"
      :disabled="props.disabled"
    >
      <div
        class="mainRow"
        :class="{ expanded: comboExpanded }"
        @click="onExpandCombo"
      >
        <div class="info">{{ selectedCount }} selected</div>
        <div class="arrow"></div>
      </div>
      <div class="dropList">
        <div
          v-for="item in items"
          v-if="comboExpanded"
          class="list-row"
          :class="{ 'is-checked': isItemChecked(item) }"
        >
          <label>
            <input
              :id="getFieldID(props.schema, true)"
              v-attributes="'input'"
              type="checkbox"
              :checked="isItemChecked(item)"
              :disabled="props.disabled"
              :name="getInputName(item)"
              @change="onChanged($event, item)"
            />{{ getItemName(item) }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isObject, isNil, clone } from "lodash";
import { slugify } from "../../utils/schema";
import { useField } from "../use-field";
import { FieldPropsObject, FieldEmitsObject, FieldExpose } from "../fields";
import { computed, onMounted, ref } from "vue";

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

const comboExpanded = ref(false);

const items = computed(() => {
  const values = props.schema.values;
  if (typeof values == "function") {
    return values.apply(this, [props.model, props.schema]);
  } else return values;
});

const selectedCount = computed(() => {
  if (value.value) return value.value.length;

  return 0;
});

function getInputName(item) {
  if (
    props.schema &&
    props.schema.inputName &&
    props.schema.inputName.length > 0
  ) {
    return slugify(props.schema.inputName + "_" + getItemValue(item));
  }
  return slugify(getItemValue(item));
}

function getItemValue(item) {
  if (isObject(item)) {
    if (
      typeof props.schema["checklistOptions"] !== "undefined" &&
      typeof props.schema["checklistOptions"]["value"] !== "undefined"
    ) {
      return item[props.schema.checklistOptions.value];
    } else {
      if (typeof item["value"] !== "undefined") {
        return item.value;
      } else {
        throw "`value` is not defined. If you want to use another key name, add a `value` property under `checklistOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/checklist.html#checklist-field-with-object-values";
      }
    }
  } else {
    return item;
  }
}

function getItemName(item) {
  if (isObject(item)) {
    if (
      typeof props.schema["checklistOptions"] !== "undefined" &&
      typeof props.schema["checklistOptions"]["name"] !== "undefined"
    ) {
      return item[props.schema.checklistOptions.name];
    } else {
      if (typeof item["name"] !== "undefined") {
        return item.name;
      } else {
        throw "`name` is not defined. If you want to use another key name, add a `name` property under `checklistOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/checklist.html#checklist-field-with-object-values";
      }
    }
  } else {
    return item;
  }
}

function isItemChecked(item) {
  return value.value && value.value.indexOf(getItemValue(item)) !== -1;
}

function onChanged(event, item) {
  if (isNil(value.value) || !Array.isArray(value.value)) {
    value.value = [];
  }

  if (event.target.checked) {
    // Note: If you modify this.value array, it won't trigger the `set` in computed field
    const arr = clone(value.value);
    arr.push(getItemValue(item));
    value.value = arr;
  } else {
    // Note: If you modify this.value array, it won't trigger the `set` in computed field
    const arr = clone(value.value);
    arr.splice(value.value.indexOf(getItemValue(item)), 1);
    value.value = arr;
  }
}

function onExpandCombo() {
  comboExpanded.value = !comboExpanded.value;
}
</script>

<style lang="scss">
.vue-form-generator .field-checklist {
  .listbox,
  .dropList {
    height: auto;
    max-height: 150px;
    overflow: auto;

    .list-row {
      label {
        font-weight: initial;
      }

      input {
        margin-right: 0.3em;
      }
    }
  }

  .combobox {
    height: initial;
    overflow: hidden;

    .mainRow {
      cursor: pointer;
      position: relative;
      padding-right: 10px;

      .arrow {
        position: absolute;
        right: -9px;
        top: 3px;
        width: 16px;
        height: 16px;

        transform: rotate(0deg);
        transition: transform 0.5s;

        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGdJREFUOI3tzjsOwjAURNGDUqSgTxU5K2AVrJtswjUsgHSR0qdxAZZFPrS+3ZvRzBsqf9MUtBtazJk+oMe0VTriiZCFX8nbpENMgfARjsn74vKj5IFruhfc8d6zIF9S/Hyk5HS4spMVeFcOjszaOwMAAAAASUVORK5CYII=");
        background-repeat: no-repeat;
      }

      &.expanded {
        .arrow {
          transform: rotate(-180deg);
        }
      }
    }

    .dropList {
      transition: height 0.5s;
      //margin-top: 0.5em;
    }
  }
}
</style>
