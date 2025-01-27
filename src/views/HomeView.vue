<template>
  <div class="home">
    <div class="hero-section">
      <h1>話題の映画をチェック</h1>
      <p>最新の人気作品をご覧ください</p>
    </div>
    
    <section class="movie-section">
      <h2>人気の映画</h2>
      <div class="movie-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card" @click="navigateToMovie(movie.id)">
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
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import FavoriteButton from '../components/FavoriteButton.vue'

const router = useRouter()
const movies = ref([])

const getImageUrl = (path) => {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.jpg'
}

const fetchMovies = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movie/popular`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ja-JP'
      }
    })
    movies.value = response.data.results
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

const navigateToMovie = (movieId) => {
  router.push(`/movie/${movieId}`)
}

onMounted(() => {
  fetchMovies()
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png');
  background-size: cover;
  background-position: center;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.movie-section {
  margin-bottom: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.movie-section h2 {
  margin-bottom: 20px;
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

  .hero-section h1 {
    font-size: 2rem;
  }
}
</style> 