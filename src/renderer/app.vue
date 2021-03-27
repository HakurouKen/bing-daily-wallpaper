<template>
  <el-form ref="form" :model="settings" label-width="120px">
    <el-form-item label="每日更新时间">
      <el-time-select
        v-model="settings.dailyUpdateTime"
        start="00:15"
        end="23:45"
        step="00:15"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const settings = reactive({ autoRunOnLaunch: true, dailyUpdateTime: '' });
    return { settings };
  },
  methods: {}
});
</script>
