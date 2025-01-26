<template>
  <div class="search-bar">
    <div class="search-input">
      <span class="mdi mdi-magnify search-icon"></span>
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="映画を検索..."
      >
    </div>
    <div class="genre-filter" v-if="genres.length">
      <select v-model="selectedGenre" @change="handleGenreChange">
        <option value="">すべてのジャンル</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">
          {{ genre.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const searchQuery = ref('')
const selectedGenre = ref('')
const genres = ref([])

const emit = defineEmits(['search', 'genreChange'])

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleGenreChange = () => {
  emit('genreChange', selectedGenre.value)
}

const fetchGenres = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ja-JP'
      }
    })
    genres.value = response.data.genres
  } catch (error) {
    console.error('Error fetching genres:', error)
  }
}

onMounted(() => {
  fetchGenres()
})
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.search-input {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

input::placeholder {
  color: #999;
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.genre-filter select {
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.genre-filter select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.genre-filter option {
  background: var(--background-color);
  color: white;
}
</style> 