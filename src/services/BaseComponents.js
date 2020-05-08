import Vue from "vue";

export const loadBaseComponents = () => {
  let requireComponent = require.context("@/components/Base/", true, /\.vue$/);

  requireComponent.keys().forEach(fileName => {
    let baseComponentConfig = requireComponent(fileName);
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig;

    let baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, "").replace(/\.\w+$/, "");

    Vue.component(baseComponentName, baseComponentConfig);
  });
};
