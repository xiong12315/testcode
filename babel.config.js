//这是项目发布阶段需要用的的babel
const prodPlugins = [];
if (process.env.NODE_DEV === 'production') {
  prodPlugins.push('babel-plugin-transform-remove-console');
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  //发布产品时候的插件数组
  plugins: [...prodPlugins, '@babel/plugin-syntax-dynamic-import']
};
