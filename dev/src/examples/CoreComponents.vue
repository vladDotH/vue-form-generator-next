<template>
  <div class="container">
    <h1>Core</h1>
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
import { prettyJSON } from "@/utils";

const isNewModel = ref(false);

const model = ref<any>({});

const schema = ref({
  fields: [
    {
      type: "label",
      label: "Created (label field)",
      model: "created",
      // get(model) {
      // 	// return model && model.created ? fecha.format(model.created,"MMMM  D YYYY H") : "-";
      // },
      styleClasses: "half-width"
    },
    {
      type: "radios",
      label: "RADIOS",
      model: "radios",
      values: [
        {
          name: "HTML5",
          value: "HTML5-123"
        },
        {
          name: "Javascript",
          value: "Javascript-123"
        },
        {
          name: "CSS3",
          value: "CSS3-123"
        },
        {
          name: "CoffeeScript",
          value: "CoffeeScript-123"
        },
        {
          name: "AngularJS",
          value: "AngularJS-123"
        },
        {
          name: "ReactJS",
          value: "ReactJS-123"
        },
        {
          name: "VueJS",
          value: "VueJS-123"
        }
      ],
      radiosOptions: {
        value: "value",
        name: "name"
      }
    },
    {
      type: "select",
      label: "Type (select field)",
      model: "type",
      required: true,
      values: [
        {
          id: "personal",
          name: "Personal"
        },
        {
          id: "business",
          name: "Business"
        }
      ],
      default: "personal"
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
@import "../style.scss";
</style>
