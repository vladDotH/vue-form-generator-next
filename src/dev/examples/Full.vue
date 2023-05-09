<template>
  <h1>Full</h1>
  <div>
    <div class="row">
      <div class="col">
        <div>
          <div v-for="(item, index) in validationErrors" :key="index">
            {{ item.field?.label }}:
            <strong>{{ item.error }}</strong>
          </div>
        </div>
        <VueFormGenerator
          ref="form"
          :schema="schema"
          :model="model"
          :options="formOptions"
          :multiple="selected.length > 1"
          :is-new-model="isNewModel"
          @model-updated="modelUpdated"
          @validated="onValidated"
        ></VueFormGenerator>
      </div>
      <div class="col">
        <pre v-if="model" v-html="prettyModel"></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import fecha from "fecha";
import { computed, ref } from "vue";
import { validators } from "@/utils/validators";
import VueFormGenerator from "@/VueFormGenerator.vue";
import { mergeMultiObjectFields } from "@/utils/schema";
import _ from "lodash";
import { prettyJSON } from "@/dev/utils";

const customAsyncValidator = function (value: any) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (value) resolve();
      else reject(["Invalid value from async validator"]);
    }, 1000);
  });
};

const isNewModel = ref(false),
  selected = ref<any[]>([]),
  model = ref<any>({}),
  formOptions = ref({
    validateAfterLoad: true,
    validateAfterChanged: true,
    validateBeforeSave: true
  }),
  form = ref<VueFormGenerator | null>(null);

const prettyModel = computed(() => prettyJSON(model.value));

const validationErrors = computed(() => {
  if (form.value && form.value.errors) return form.value.errors;
  return [];
});

function onValidated(res: any, errors: any) {
  console.log("VFG validated:", res, errors);
}

function validate() {
  // console.log("validate", this.$refs.form, this.$refs.form.validate());
  return form.value.validate();
}

function modelUpdated(newVal: any, schema: any) {
  console.log("main model has updated", newVal, schema);
}

const schema = {
  fields: [
    /** *********/
    /*  INPUT   */
    /** *********/
    {
      type: "input",
      inputType: "hidden",
      label: "--- INPUT ---",
      model: "",
      styleClasses: "alert alert-info"
    },
    {
      type: "input",
      inputType: "hidden",
      label: "Hidden",
      model: "id",
      inputName: "hiddenField"
    },
    {
      type: "input",
      inputType: "text",
      label: "First name",
      model: "firstName",
      featured: true,
      required: true,
      help: "First name of user",
      placeholder: "User's first name",
      styleClasses: "half-width col-xs-12 col-sm-6",
      validator: validators.string,
      onChanged(model: any, newVal: any, oldVal: any) {
        console.log(
          `Model's name changed from ${oldVal} to ${newVal}. Model:`,
          model
        );
      },
      onValidated(model: any, errors: any) {
        if (errors.length > 0)
          console.warn("Validation error in Name field! Errors:", errors);
      }
    },
    {
      type: "input",
      inputType: "text",
      label: "Last name",
      model: "lastName",
      featured: true,
      required: true,
      placeholder: "User's last name",
      styleClasses: "half-width col-xs-12 col-sm-6",
      validator: validators.string
    },
    {
      type: "input",
      inputType: "url",
      label: "URL",
      model: "website",
      placeholder: "Enter your website",
      inputName: "website",
      validator: customAsyncValidator // validators.url
    },
    {
      type: "input",
      inputType: "tel",
      label: "Telephone",
      model: "phone",
      placeholder: "Enter your phone number",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "password",
      label: "Password",
      model: "password",
      placeholder: "Enter your password",
      min: 6,
      required: true,
      hint: "Minimum 6 characters",
      styleClasses: "half-width",
      validator: validators.string.locale?.({
        fieldIsRequired: "The password is required!",
        textTooSmall: "Password must be at least {1} characters!"
      })
    },
    {
      type: "input",
      inputType: "date",
      label: "Date",
      model: "dob",
      styleClasses: "half-width"
      // format: "YYYY.MM.DD HH:mm:ss"
    },
    {
      type: "input",
      inputType: "datetime",
      label: "Datetime",
      model: "dob",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "datetime-local",
      label: "Datetime local",
      model: "dob",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "time",
      label: "Time",
      model: "time",
      step: 1,
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "month",
      label: "Month",
      model: "month",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "week",
      label: "Week",
      model: "week",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "number",
      label: "Number",
      model: "age",
      styleClasses: "half-width"
      // validator: validators.number
    },
    {
      type: "input",
      inputType: "range",
      label: "Range",
      model: "rank",
      min: 0,
      max: 10,
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "color",
      label: "Color",
      model: "color",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "checkbox",
      label: "Checkbox (show useless)",
      model: "checkbox",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "search",
      label: "Search USELESS",
      model: "search",
      placeholder: "Entrez un mot-clef",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "radio",
      label: "radio USELESS",
      model: "radio",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "image",
      label: "Image USELESS",
      model: "image",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "button",
      label: "Button USELESS",
      model: "button",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "reset",
      label: "Reset USELESS",
      model: "reset",
      styleClasses: "half-width"
    },
    {
      type: "input",
      inputType: "submit",
      label: "Submit USELESS",
      model: "submit",
      styleClasses: "half-width"
    },

    /** ************/
    /*  BUILD IN   */
    /** ************/

    {
      type: "input",
      inputType: "hidden",
      label: "--- BUILD IN ---",
      model: "",
      styleClasses: "alert alert-info"
    },
    {
      type: "checklist",
      label: "CHECKLIST combobox",
      model: "checklistcombobox",
      listBox: false,
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
      ]
    },
    {
      type: "checklist",
      label: "CHECKLIST listBox",
      model: "checklistlistbox",
      listBox: true,
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
      ]
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
      type: "radios",
      label: "RADIOS2",
      model: "radios2",
      values: [
        "HTML5",
        "Javascript",
        "CSS3",
        "CoffeeScript",
        "AngularJS",
        "ReactJS",
        "VueJS"
      ]
    },
    {
      type: "textArea",
      label: "Biography (textArea field)",
      model: "bio",
      hint(model: any) {
        if (model && model.bio) {
          return model.bio.length + " of max 500 characters used!";
        }
      },
      max: 500,
      placeholder: "User's biography",
      rows: 4,
      validator: validators.string
    },
    {
      type: "input",
      inputType: "text",
      label: "Field with buttons",
      model: "address.geo",
      disabled: false,
      get(model: any) {
        if (model && model.address && model.address.geo)
          return (
            model.address.geo.latitude + ", " + model.address.geo.longitude
          );
      },
      set(model: any, val: any) {
        const values = val.split(",");
        if (!model.address) model.address = {};
        if (!model.address.geo) model.address.geo = {};
        if (values.length > 0 && values[0].trim() !== "")
          model.address.geo.latitude = parseFloat(values[0].trim());
        else model.address.geo.latitude = 0;
        if (values.length > 1 && values[1].trim() !== "")
          model.address.geo.longitude = parseFloat(values[1].trim());
        else model.address.geo.longitude = 0;
      },
      buttons: [
        {
          classes: "btn-location",
          label: "Current location"
          // onclick: function (model: any) {
          //   return this.$parent.getLocation(model);
          // }
        },
        {
          classes: "btn-clear",
          label: "Clear",
          onclick: function (model: any) {
            model.address.geo = {
              latitude: 0,
              longitude: 0
            };
          }
        }
      ]
    },
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
      type: "submit",
      label: "",
      buttonText: "Submit form",
      validateBeforeSubmit: true,
      onSubmit(model: any) {
        console.log("Form submitted!", model);
        alert("Form submitted!");
      },
      styleClasses: "half-width",
      disabled() {
        // console.log("Disabled: ", this.errors.length > 0);
        return form.value?.errors?.length > 0;
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
    },

    {
      type: "select",
      label: "Role",
      model: "role",
      required: true,
      selectOptions: {
        noneSelectedText: "Nincs kijelölve"
      },
      values: [
        {
          id: "admin",
          name: "Administrator"
        },
        {
          id: 0,
          name: "Zero"
        },
        {
          id: "moderator",
          name: "Moderator"
        },
        {
          id: "user",
          name: "Registered User"
        },
        {
          id: "visitor",
          name: "Visitor"
        }
      ],
      styleClasses: "half-width",
      validator: validators.required
    },
    {
      type: "select",
      label: "Language",
      model: "language",
      required: true,
      values: [
        {
          id: "en-GB",
          name: "English (GB)"
        },
        {
          id: "en-US",
          name: "English (US)"
        },
        {
          id: "de",
          name: "German"
        },
        {
          id: "it",
          name: "Italic"
        },
        {
          id: "fr",
          name: "French"
        }
      ],
      hint: "Your native language",
      styleClasses: "half-width",
      validator: validators.required
    },

    /** **********/
    /*  JQUERY   */
    /** **********/

    {
      type: "input",
      inputType: "hidden",
      label: "--- JQUERY ---",
      model: "",
      styleClasses: "alert alert-info"
    },

    /** ***********/
    /*  VANILLA   */
    /** ***********/

    {
      type: "input",
      inputType: "hidden",
      label: "--- VANILLA ---",
      model: "",
      styleClasses: "alert alert-info"
    },

    /** *****************/
    /*  CUSTOM FIELDS   */
    /** *****************/

    {
      type: "input",
      inputType: "hidden",
      label: "--- CUSTOM FIELDS ---",
      model: "",
      styleClasses: "alert alert-info"
    },
    {
      type: "awesome",
      label: "Awesome (custom field)",
      model: "userName"
    }
  ]
};
</script>

<style scoped lang="scss">
.row {
  display: flex;
}
.col {
  width: 50%;
  padding: 0 2em;
}
</style>
