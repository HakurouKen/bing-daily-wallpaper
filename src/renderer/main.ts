import { createApp } from 'vue';
import App from '@/renderer/app.vue';
import ElementPlus from 'element-plus';
import 'normalize.css';
import 'element-plus/lib/theme-chalk/index.css';
import '@/renderer/index.css';

createApp(App).use(ElementPlus).mount('#app');
