import { createApp } from 'vue';
import app from '@/app.vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import '@/index.css';

createApp(app).use(ElementPlus).mount('#app');
