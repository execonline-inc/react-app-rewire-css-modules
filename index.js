const path = require('path');
const cloneDeep = require('lodash.clonedeep');
const cssNext = require('postcss-cssnext');

const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || [];

const findIndexAndRules = (rulesSource, ruleMatcher) => {
  let result = undefined;
  const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource);
  rules.some((rule, index) => result = ruleMatcher(rule) ? {index, rules} : findIndexAndRules(ruleChildren(rule), ruleMatcher));
  return result;
};

const findRule = (rulesSource, ruleMatcher) => {
  const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher);
  return rules[index];
};

const cssRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.css$/);

const createLoaderMatcher = (loader) => (rule) => rule.loader && rule.loader.indexOf(`${path.sep}${loader}${path.sep}`) !== -1;
const cssLoaderMatcher = createLoaderMatcher('css-loader');
const postcssLoaderMatcher = createLoaderMatcher('postcss-loader');
const fileLoaderMatcher = createLoaderMatcher('file-loader');

const addAfterRule = (rulesSource, ruleMatcher, value) => {
  const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher);
  rules.splice(index + 1, 0, value);
};

const addBeforeRule = (rulesSource, ruleMatcher, value) => {
  const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher);
  rules.splice(index, 0, value);
};

module.exports = function (config, env, customProperties) {
  customProperties = customProperties || {};
  const cssRule = findRule(config.module.rules, cssRuleMatcher);
  const cssModuleRule = cloneDeep(cssRule);
  const postcssRule = findRule(cssModuleRule, postcssLoaderMatcher);

  cssRule.exclude = /.*react-higgs\/.*\.css$|.*\.module\.css$/; // exclude higgs and xxx.module.css
  cssModuleRule.test = /.*react-higgs\/.*\.css$|.*\.module\.css$/;

  const cssModulesRuleCssLoader = findRule(cssModuleRule, cssLoaderMatcher);
  cssModulesRuleCssLoader.options = Object.assign({modules: true, localIdentName: '[name]__[local]___[hash:base64:5]'}, cssModulesRuleCssLoader.options);

  const plugins = postcssRule.options.plugins(); // func
  plugins.unshift(cssNext({
    features: {
      customProperties: {
        variables: customProperties,
      },
    },
  }));

  postcssRule.options.plugins = () => plugins;
  addBeforeRule(config.module.rules, fileLoaderMatcher, cssModuleRule);
  return config
};
