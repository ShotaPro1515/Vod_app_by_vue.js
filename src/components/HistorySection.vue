<template>
  <div class="history-section">
    <div class="section-header">
      <h2>視聴履歴</h2>
      <button v-if="history.length" @click="clearHistory" class="clear-button">
        履歴をクリア
      </button>
    </div>
    
    <div v-if="history.length" class="history-grid">
      <div v-for="movie in history" :key="movie.id" class="history-card" @click="navigateToMovie(movie.id)">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="meta">
            <div class="rating">
              <span class="mdi mdi-star"></span>
              {{ movie.vote_average.toFixed(1) }}
            </div>
            <div class="watched-date">
              {{ formatDate(movie.watched_at) }}
            </div>
          </div>
        </div>
        <button class="remove-button" @click.stop="removeFromHistory(movie.id)">
          <span class="mdi mdi-close"></span>
        </button>
      </div>
    </div>
    <div v-else class="no-history">
      視聴履歴がありません
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '../stores/history'

const props = defineProps({
  limit: {
    type: Number,
    default: 12
  }
})

const router = useRouter()
const historyStore = useHistoryStore()

const history = computed(() => {
  return historyStore.getRecentHistory(props.limit)
})

const getImageUrl = (path) => {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.jpg'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const navigateToMovie = (movieId) => {
  router.push(`/movie/${movieId}`)
}

const removeFromHistory = (movieId) => {
  historyStore.removeFromHistory(movieId)
}

const clearHistory = () => {
  if (confirm('視聴履歴をクリアしますか？')) {
    historyStore.clearHistory()
  }
}
</script>

<style scoped>
.history-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.clear-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: #aaa;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-button:hover {
  background: rgba(229, 9, 20, 0.8);
  color: white;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.history-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.history-card:hover {
  transform: scale(1.05);
}

.history-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 1rem;
}

.movie-info h3 {
  margin: 0;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating .mdi-star {
  color: #ffd700;
}

.watched-date {
  color: #aaa;
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  opacity: 0;
}

.history-card:hover .remove-button {
  opacity: 1;
}

.remove-button:hover {
  background: rgba(229, 9, 20, 0.8);
}

.no-history {
  text-align: center;
  padding: 2rem;
  color: #aaa;
}

@media (max-width: 600px) {
  .history-grid {
    grid-template-columns: 1fr;
  }

  .history-card img {
    height: 200px;
  }

  .remove-button {
    opacity: 1;
  }
}
</style> 