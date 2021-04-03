<template>
  <el-container>
    <el-main v-loading="loading">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="12">
          <el-form ref="form" :model="settings" label-width="120px">
            <el-form-item label="每日更新时间">
              <TimeSelect
                v-model="settings.dailyUpdateTime"
                placeholder="更新时间"
                start="00:15"
                end="23:45"
                step="00:15"
              />
            </el-form-item>
            <el-form-item label="开机自动启动">
              <el-switch v-model="settings.autoLaunch" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { get, setAutoLaunch, setDailyUpdateTime } from './libs/apis/settings';
import TimeSelect from './components/time-select.vue';

export default defineComponent({
  name: 'App',
  components: { TimeSelect },
  data() {
    return {
      loading: false,
      settings: { autoLaunch: false, dailyUpdateTime: '' }
    };
  },
  watch: {
    'settings.autoLaunch'(v) {
      setAutoLaunch({ autoLaunch: v });
    },
    'settings.dailyUpdateTime'(v) {
      setDailyUpdateTime({ dailyUpdateTime: v });
    }
  },
  async created() {
    this.loading = true;
    const settings = await get(null);
    this.settings = settings;
    this.loading = false;
  }
});
</script>
