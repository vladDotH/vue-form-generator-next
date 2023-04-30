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
import { prettyJSON } from "@/utils";
import validators from "../../../src/utils/validators";

const isNewModel = ref(false);

const model = ref<any>({
  skills: ["Javascript", "VueJS"]
});

const schema = ref({
  fields: [
    {
      type: "checklist",
      label: "Skills",
      model: "skills",
      required: true,
      inputName: "skill",
      min: 2,
      listBox: true,
      values: [
        "HTML5",
        "Javascript",
        "CSS3",
        "CoffeeScript",
        "AngularJS",
        "ReactJS",
        "VueJS"
      ],
      validator: validators.array,
      onChanged(model: any) {
        console.log("skills changed to", model.skills);
      },
      onValidated(model: any, errors: any[]) {
        console.log("skills validated:", errors);
      }
    }
  ]
});

const formOptions = {
  validateAfterChanged: true
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
