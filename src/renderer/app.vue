<template>
  <div id="app">
    <el-form
      v-loading="loading"
      class="setting-form"
      :model="settings"
      label-width="120px"
    >
      <el-form-item label="每日更新时间">
        <TimePicker
          v-model="settings.dailyUpdateTime"
          @blur="updateDailyUpdateTime"
          placeholder="更新时间"
          format="HH:mm"
        />
      </el-form-item>
      <el-form-item label="开机自动启动">
        <el-switch v-model="settings.autoLaunch" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue';
import { get, setAutoLaunch, setDailyUpdateTime } from './libs/apis/settings';
import TimePicker from './components/time-picker.vue';

export default defineComponent({
  name: 'App',
  components: { TimePicker },
  setup() {
    let loading = ref(false);
    const settings = reactive({
      autoLaunch: false,
      dailyUpdateTime: ''
    });

    watch(
      () => settings.autoLaunch,
      (v) => setAutoLaunch({ autoLaunch: v })
    );
    const updateDailyUpdateTime = () =>
      setDailyUpdateTime({ dailyUpdateTime: settings.dailyUpdateTime });

    onBeforeMount(async () => {
      loading.value = true;
      const { autoLaunch, dailyUpdateTime } = await get(null);
      settings.autoLaunch = autoLaunch;
      settings.dailyUpdateTime = dailyUpdateTime;
      loading.value = false;
    });

    return {
      loading,
      settings,
      updateDailyUpdateTime
    };
  }
});
</script>

<style scoped>
#app {
  height: 100%;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}

.setting-form {
  margin-top: 30px;
}
</style>
