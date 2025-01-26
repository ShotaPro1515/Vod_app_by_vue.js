<template>
  <div class="movies">
    <div class="filters">
      <SearchBar 
        @search="handleSearch"
        @genre-change="handleGenreChange"
      />
      <SortSelect @sort-change="handleSortChange" />
    </div>
    
    <section class="movie-section">
      <h2>{{ searchQuery ? '検索結果' : 'すべての映画' }}</h2>
      <div v-if="loading" class="loading">
        <span class="mdi mdi-loading mdi-spin"></span> 読み込み中...
      </div>
      <div v-else-if="movies.length === 0" class="no-results">
        映画が見つかりませんでした
      </div>
      <div v-else class="movie-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card" @click="navigateToMovie(movie.id)">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
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

    <Pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import SearchBar from '../components/SearchBar.vue'
import Pagination from '../components/Pagination.vue'
import SortSelect from '../components/SortSelect.vue'

const router = useRouter()
const movies = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const searchQuery = ref('')
const selectedGenre = ref('')
const sortBy = ref('popularity.desc')

const getImageUrl = (path) => {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.jpg'
}

const fetchMovies = async () => {
  loading.value = true
  try {
    const endpoint = searchQuery.value
      ? `${import.meta.env.VITE_API_BASE_URL}/search/movie`
      : `${import.meta.env.VITE_API_BASE_URL}/discover/movie`

    const response = await axios.get(endpoint, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ja-JP',
        query: searchQuery.value,
        with_genres: selectedGenre.value,
        page: currentPage.value,
        sort_by: sortBy.value,
        include_adult: false
      }
    })
    
    movies.value = response.data.results
    totalPages.value = Math.min(response.data.total_pages, 500)
  } catch (error) {
    console.error('Error fetching movies:', error)
    movies.value = []
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

const navigateToMovie = (movieId) => {
  router.push(`/movie/${movieId}`)
}

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
  fetchMovies()
}

const handleGenreChange = (genreId) => {
  selectedGenre.value = genreId
  currentPage.value = 1
  fetchMovies()
}

const handleSortChange = (sort) => {
  sortBy.value = sort
  currentPage.value = 1
  fetchMovies()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchMovies()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([searchQuery, selectedGenre, sortBy], () => {
  currentPage.value = 1
  fetchMovies()
})

fetchMovies()
</script>

<style scoped>
.movies {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.movie-section {
  margin-bottom: 40px;
}

.movie-section h2 {
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.loading .mdi-loading {
  font-size: 2rem;
  margin-right: 0.5rem;
}

.no-results {
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
  
  .filters {
    flex-direction: column;
    gap: 1rem;
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