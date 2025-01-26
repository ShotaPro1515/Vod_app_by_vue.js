<template>
  <div class="pagination">
    <button 
      :disabled="currentPage === 1" 
      @click="$emit('page-change', currentPage - 1)"
      class="page-button"
    >
      <span class="mdi mdi-chevron-left"></span>
    </button>
    
    <div class="page-numbers">
      <button 
        v-for="page in displayedPages" 
        :key="page"
        :class="['page-number', { active: page === currentPage }]"
        @click="$emit('page-change', page)"
      >
        {{ page }}
      </button>
    </div>

    <button 
      :disabled="currentPage === totalPages" 
      @click="$emit('page-change', currentPage + 1)"
      class="page-button"
    >
      <span class="mdi mdi-chevron-right"></span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const displayedPages = computed(() => {
  const pages = []
  let start = Math.max(1, props.currentPage - 2)
  let end = Math.min(props.totalPages, start + 4)
  
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-button,
.page-number {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.page-button:hover:not(:disabled),
.page-number:hover:not(.active) {
  background: rgba(255, 255, 255, 0.2);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background: var(--primary-color);
}
</style> 