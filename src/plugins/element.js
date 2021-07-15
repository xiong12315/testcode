import Vue from 'vue';
import Element, { Message, MessageBox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element);
Vue.prototype.$message = Message; //将message进行挂载，可以用$进行访问
Vue.prototype.$confirm = MessageBox.confirm; //将confirm进行挂载，可以用$进行访问
