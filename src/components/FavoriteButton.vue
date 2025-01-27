<template>
  <button 
    class="favorite-button" 
    :class="{ active: isFavorite }"
    @click.stop="toggleFavorite"
  >
    <span class="mdi" :class="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"></span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favorites'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.movie.id)
})

const toggleFavorite = () => {
  if (isFavorite.value) {
    favoritesStore.removeFavorite(props.movie.id)
  } else {
    favoritesStore.addFavorite(props.movie)
  }
}
</script>

<style scoped>
.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
}

.favorite-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.favorite-button .mdi {
  color: white;
  font-size: 1.5rem;
}

.favorite-button.active {
  background: rgba(229, 9, 20, 0.8);
}

.favorite-button.active:hover {
  background: rgba(229, 9, 20, 1);
}

.favorite-button.active .mdi {
  color: white;
}
</style> 