<template>
  <div class="sort-select">
    <select v-model="selectedSort" @change="handleSortChange">
      <option value="popularity.desc">人気順</option>
      <option value="vote_average.desc">評価の高い順</option>
      <option value="release_date.desc">公開日が新しい順</option>
      <option value="release_date.asc">公開日が古い順</option>
      <option value="original_title.asc">タイトル順</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedSort = ref('popularity.desc')
const emit = defineEmits(['sort-change'])

const handleSortChange = () => {
  emit('sort-change', selectedSort.value)
}
</script>

<style scoped>
.sort-select {
  margin-left: 1rem;
}

select {
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

option {
  background: var(--background-color);
  color: white;
}
</style> 