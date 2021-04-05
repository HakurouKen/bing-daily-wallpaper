import 'normalize.css';
import 'element-plus/lib/theme-chalk/index.css';
import '@/renderer/index.css';

import { createApp } from 'vue';
import App from '@/renderer/app.vue';
import ElementPlus from 'element-plus';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale/lang/zh-cn';

createApp(App).use(ElementPlus, { locale }).mount('#app');
