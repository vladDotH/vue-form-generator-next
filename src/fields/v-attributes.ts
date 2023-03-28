import { Directive, DirectiveBinding, VNode } from "vue";
import { FieldProps } from "./fields";
import { forEach, get, isString } from "lodash";

function attributesDirective(
  el: Element,
  binding: DirectiveBinding,
  vnode: VNode<any, any, FieldProps>
) {
  let attrs = vnode?.props?.schema?.attributes ?? {};
  const container = binding.value || "input";
  if (isString(container)) {
    attrs = get(attrs, container) || attrs;
  }
  forEach(attrs, (val, key) => {
    el.setAttribute(key, val);
  });
}

export const vAttributes: Directive = {
  mounted: attributesDirective,
  updated: attributesDirective
};
