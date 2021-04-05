<template>
  <el-time-picker
    format="HH:mm"
    :placeholder="placeholder"
    :model-value="value"
    @focus="(event) => $emit('focus', event)"
    @blur="(event) => $emit('blur', blur)"
    @change="(event) => $emit('change', event)"
    @update:model-value="updateValue"
  />
</template>

<script>
import { computed } from 'vue';
import dayjs from 'dayjs';

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'focus', 'blur', 'change'],
  setup(props, { emit }) {
    const value = computed(() => dayjs(props.modelValue, 'HH:mm').toDate());
    const updateValue = (v) => {
      const d = dayjs(v);
      if (!d.isValid()) {
        emit('update:modelValue', '');
        return;
      }
      const stringifiedValue = d.format('HH:mm');
      emit('update:modelValue', stringifiedValue);
    };
    return { value, updateValue };
  }
};
</script>
