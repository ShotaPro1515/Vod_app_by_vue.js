<template>
  <div v-if="movie" class="movie-detail">
    <div class="backdrop" :style="{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }">
      <div class="overlay">
        <div class="content">
          <div class="poster-container">
            <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" class="poster">
            <FavoriteButton :movie="movie" class="detail-favorite-button" />
          </div>
          <div class="info">
            <div class="title-section">
              <h1>{{ movie.title }}</h1>
              <button v-if="trailerKey" @click="showTrailer = true" class="trailer-button">
                <span class="mdi mdi-play"></span>
                トレーラーを再生
              </button>
            </div>
            <div class="meta">
              <span class="rating">
                <span class="mdi mdi-star"></span>
                {{ movie.vote_average.toFixed(1) }}
              </span>
              <span class="year">{{ new Date(movie.release_date).getFullYear() }}</span>
              <span class="runtime" v-if="movie.runtime">{{ movie.runtime }}分</span>
            </div>
            <p class="tagline" v-if="movie.tagline">{{ movie.tagline }}</p>
            <p class="overview">{{ movie.overview }}</p>
            <div class="genres">
              <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
                {{ genre.name }}
              </span>
            </div>
            <div class="rating-section">
              <h3>この映画を評価する</h3>
              <div class="star-rating">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  class="star-button"
                  :class="{ active: userRating >= star }"
                  @click="setRating(star)"
                >
                  <span class="mdi mdi-star"></span>
                </button>
              </div>
            </div>
            <div class="additional-info">
              <div class="info-item">
                <h3>公開日</h3>
                <p>{{ formatDate(movie.release_date) }}</p>
              </div>
              <div class="info-item">
                <h3>原題</h3>
                <p>{{ movie.original_title }}</p>
              </div>
              <div class="info-item" v-if="movie.budget">
                <h3>製作費</h3>
                <p>{{ formatCurrency(movie.budget) }}</p>
              </div>
              <div class="info-item" v-if="movie.revenue">
                <h3>興行収入</h3>
                <p>{{ formatCurrency(movie.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cast-section" v-if="cast.length">
      <h2>キャスト</h2>
      <div class="cast-grid">
        <div v-for="actor in cast" :key="actor.id" class="cast-card">
          <img :src="getImageUrl(actor.profile_path)" :alt="actor.name">
          <div class="cast-info">
            <h3>{{ actor.name }}</h3>
            <p>{{ actor.character }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="similar-section" v-if="similarMovies.length">
      <h2>関連する映画</h2>
      <div class="similar-grid">
        <div v-for="movie in similarMovies" :key="movie.id" class="movie-card" @click="loadMovie(movie.id)">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
          <FavoriteButton :movie="movie" />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <ReviewSection :movie-id="route.params.id" />

    <!-- トレーラーモーダル -->
    <div v-if="showTrailer" class="trailer-modal" @click="showTrailer = false">
      <div class="trailer-content" @click.stop>
        <button class="close-button" @click="showTrailer = false">
          <span class="mdi mdi-close"></span>
        </button>
        <iframe
          :src="'https://www.youtube.com/embed/' + trailerKey"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import FavoriteButton from '../components/FavoriteButton.vue'
import { useRatingsStore } from '../stores/ratings'
import { useHistoryStore } from '../stores/history'
import ReviewSection from '../components/ReviewSection.vue'

const route = useRoute()
const router = useRouter()
const movie = ref(null)
const similarMovies = ref([])
const cast = ref([])
const trailerKey = ref(null)
const showTrailer = ref(false)
const ratingsStore = useRatingsStore()
const userRating = computed(() => ratingsStore.getRating(route.params.id))
const historyStore = useHistoryStore()

const getImageUrl = (path, size = 'w500') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.jpg'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movie/${id}`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ja-JP'
      }
    })
    movie.value = response.data
    historyStore.addToHistory(response.data)
  } catch (error) {
    console.error('Error fetching movie details:', error)
  }
}

const fetchTrailer = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movie/${id}/videos`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ja-JP'
      }
    })
    const videos = response.data.results
    const trailer = videos.find(video => video.type === 'Trailer') || videos[0]
    trailerKey.value = trailer?.key
  } catch (error) {
    console.error('Error fetching trailer:', error)
  }
}

const setRating = (rating) => {
  ratingsStore.setRating(route.params.id, rating)
}

const fetchCast = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movie/${id}/credits`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ja-JP'
      }
    })
    cast.value = response.data.cast.slice(0, 8)
  } catch (error) {
    console.error('Error fetching cast:', error)
  }
}

const fetchSimilarMovies = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movie/${id}/similar`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ja-JP'
      }
    })
    similarMovies.value = response.data.results.slice(0, 6)
  } catch (error) {
    console.error('Error fetching similar movies:', error)
  }
}

const loadMovie = async (id) => {
  router.push(`/movie/${id}`)
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchMovieDetails(newId)
    fetchSimilarMovies(newId)
    fetchCast(newId)
    fetchTrailer(newId)
  }
})

onMounted(() => {
  if (route.params.id) {
    fetchMovieDetails(route.params.id)
    fetchSimilarMovies(route.params.id)
    fetchCast(route.params.id)
    fetchTrailer(route.params.id)
  }
})
</script>

<style scoped>
.movie-detail {
  min-height: 100vh;
}

.backdrop {
  position: relative;
  height: 70vh;
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.9) 20%, transparent);
  display: flex;
  align-items: center;
}

.content {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.poster-container {
  position: relative;
}

.poster {
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.detail-favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  transform: scale(1.2);
}

.info {
  flex: 1;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info h1 {
  font-size: 2.5rem;
  margin: 0;
}

.trailer-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.trailer-button:hover {
  background: #ff0f1f;
}

.meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

.rating .mdi-star {
  color: #ffd700;
}

.tagline {
  font-style: italic;
  color: #aaa;
  margin-bottom: 1rem;
}

.overview {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  max-width: 800px;
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.genre-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.rating-section {
  margin-bottom: 2rem;
}

.rating-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #aaa;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
}

.star-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.star-button .mdi {
  font-size: 1.5rem;
  color: #666;
}

.star-button:hover {
  transform: scale(1.2);
}

.star-button.active .mdi {
  color: #ffd700;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.info-item h3 {
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.info-item p {
  font-size: 1.1rem;
}

.trailer-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.trailer-content {
  position: relative;
  width: 90%;
  max-width: 1000px;
  aspect-ratio: 16/9;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

.trailer-content iframe {
  width: 100%;
  height: 100%;
}

.cast-section,
.similar-section {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.cast-section h2,
.similar-section h2 {
  margin-bottom: 1.5rem;
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.cast-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.cast-card:hover {
  transform: scale(1.05);
}

.cast-card img {
  width: 100%;
  height: 225px;
  object-fit: cover;
}

.cast-info {
  padding: 1rem;
}

.cast-info h3 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.cast-info p {
  font-size: 0.9rem;
  color: #aaa;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.movie-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: 270px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  border-radius: 0 0 8px 8px;
}

.movie-info h3 {
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 900px) {
  .content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .poster {
    width: 200px;
  }

  .title-section {
    flex-direction: column;
  }

  .meta,
  .genres {
    justify-content: center;
  }

  .star-rating {
    justify-content: center;
  }

  .additional-info {
    text-align: left;
  }
}

@media (max-width: 600px) {
  .backdrop {
    height: auto;
    background: none;
  }

  .overlay {
    position: relative;
    background: none;
  }

  .content {
    padding: 1rem;
  }

  .info h1 {
    font-size: 2rem;
  }

  .cast-section,
  .similar-section {
    padding: 1rem;
  }

  .trailer-content {
    width: 100%;
  }
}
</style> 