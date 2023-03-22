// import {forEach} from "lodash";
import fieldInput from "../fields/core/fieldInput.vue";
// import fieldCheckbox from "../fields/core/fieldCheckbox.vue";
// import fieldLabel from "../fields/core/fieldLabel.vue";
// import fieldSubmit from "../fields/core/fieldSubmit.vue";
// import fieldSelect from "../fields/core/fieldSelect.vue";
// import fieldChecklist from "../fields/core/fieldChecklist.vue";
// import fieldRadios from "../fields/core/fieldRadios.vue";

const fieldComponents = {};

// let coreFields = require.context("../fields/core", false, /^\.\/field([\w-_]+)\.vue$/);
//
// forEach(coreFields.keys(), (key) => {
// 	let compName = key.replace(/^\.\//, "").replace(/\.vue/, "");
// 	fieldComponents[compName] = coreFields(key).default;
// });
//
// if (process.env.FULL_BUNDLE) {
// 	let optionalFields = require.context("../fields/optional", false, /^\.\/field([\w-_]+)\.vue$/);
//
// 	forEach(optionalFields.keys(), (key) => {
// 		let compName = key.replace(/^\.\//, "").replace(/\.vue/, "");
// 		fieldComponents[compName] = optionalFields(key).default;
// 	});
// }

export default {
  fieldInput
  // fieldCheckbox,
  // fieldLabel,
  // fieldSubmit,
  // fieldSelect,
  // fieldChecklist,
  // fieldRadios
};
