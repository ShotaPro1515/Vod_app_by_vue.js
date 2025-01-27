<template>
  <div class="favorites">
    <h1>お気に入り</h1>
    <div v-if="favorites.length === 0" class="no-favorites">
      お気に入りの映画がありません
    </div>
    <div v-else class="movie-grid">
      <div v-for="movie in favorites" :key="movie.id" class="movie-card" @click="navigateToMovie(movie.id)">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
        <FavoriteButton :movie="movie" />
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="meta">
            <div class="rating">
              <span class="mdi mdi-star"></span>
              {{ movie.vote_average.toFixed(1) }}
            </div>
            <div class="year" v-if="movie.release_date">
              {{ new Date(movie.release_date).getFullYear() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import FavoriteButton from '../components/FavoriteButton.vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const favorites = favoritesStore.favorites

const getImageUrl = (path) => {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.jpg'
}

const navigateToMovie = (movieId) => {
  router.push(`/movie/${movieId}`)
}
</script>

<style scoped>
.favorites {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
}

.no-favorites {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #999;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.movie-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: 360px;
  object-fit: cover;
}

.movie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
}

.movie-info h3 {
  margin: 0;
  font-size: 1rem;
  margin-bottom: 8px;
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

.year {
  color: #aaa;
}

@media (max-width: 1200px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .movie-grid {
    grid-template-columns: 1fr;
  }

  .movie-card img {
    height: 400px;
  }
}
</style> 