<template>
  <div class="container">
    <h1>Basic</h1>
    <div class="row">
      <div class="col-sm-12">
        <VueFormGenerator
          :schema="schema"
          :model="model"
          :options="formOptions"
          :is-new-model="isNewModel"
          @model-updated="modelUpdated"
          @validated="onValidated"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <pre v-if="model" v-html="prettyModel"></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { prettyJSON } from "@/dev/utils";

const isNewModel = ref(false);

const model = ref<any>({
  first_name: "David",
  last_name: "Higgins",
  status: true
});

const schema = ref({
  fields: [
    {
      type: "input",
      inputType: "text",
      label: "First Name",
      model: "first_name",
      attributes: {
        input: {
          "data-toggle": "tooltip"
        },
        wrapper: {
          "data-target": "input"
        }
      }
    },
    {
      type: "checkbox",
      label: "Active",
      model: "status",
      attributes: {
        input: {
          "data-toggle": "tooltip"
        }
      }
    },
    {
      type: "input",
      inputType: "color",
      label: "Color",
      model: "color",
      attributes: {
        input: {
          "data-target": "tooltip"
        }
      }
    },
    {
      type: "submit",
      buttonText: "Change Previous Type",
      attributes: {
        input: {
          "data-target": "toggle"
        }
      },
      onSubmit: () => {
        if (schema.value.fields[2].inputType === "color") {
          schema.value.fields[2].inputType = "text";
        } else {
          schema.value.fields[2].inputType = "color";
          model.value.color = "#000000";
        }
      }
    }
  ]
});

const formOptions = {
  validateAfterLoad: true,
  validateAfterChanged: true,
  validateBeforeSave: true
};

const prettyModel = computed(() => prettyJSON(model.value));

function onValidated(res: any, errors: any) {
  console.log("VFG validated:", res, errors);
}

function modelUpdated(newVal: any, schema: any) {
  console.log("main model has updated", newVal, schema);
}
</script>

<style lang="scss">
@import "@/dev/style";
</style>
