import fieldTextArea from "../fields/core/fieldTextArea.vue";

const fieldComponents = {
  fieldTextArea
};

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

export default fieldComponents;
