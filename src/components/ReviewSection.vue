<template>
  <div class="review-section">
    <h2>レビュー</h2>
    
    <!-- レビュー投稿フォーム -->
    <div class="review-form">
      <textarea
        v-model="newReview"
        placeholder="この映画のレビューを書く..."
        rows="3"
      ></textarea>
      <button @click="submitReview" :disabled="!newReview.trim()">
        投稿する
      </button>
    </div>

    <!-- レビュー一覧 -->
    <div v-if="reviews.length" class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <span class="review-date">{{ formatDate(review.date) }}</span>
          <button class="delete-button" @click="deleteReview(review.id)">
            <span class="mdi mdi-delete"></span>
          </button>
        </div>
        <p class="review-text">{{ review.text }}</p>
      </div>
    </div>
    <div v-else class="no-reviews">
      まだレビューがありません
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReviewsStore } from '../stores/reviews'

const props = defineProps({
  movieId: {
    type: [String, Number],
    required: true
  }
})

const reviewsStore = useReviewsStore()
const reviews = ref([])
const newReview = ref('')

const loadReviews = () => {
  reviews.value = reviewsStore.getReviews(props.movieId)
}

const submitReview = () => {
  if (newReview.value.trim()) {
    reviewsStore.setReview(props.movieId, newReview.value.trim())
    newReview.value = ''
    loadReviews()
  }
}

const deleteReview = (reviewId) => {
  reviewsStore.removeReview(props.movieId, reviewId)
  loadReviews()
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadReviews()
})
</script>

<style scoped>
.review-section {
  margin-top: 2rem;
}

.review-form {
  margin-bottom: 2rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
}

textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

button {
  padding: 0.5rem 1.5rem;
  background: var(--primary-color);
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background: #ff0f1f;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-date {
  color: #aaa;
  font-size: 0.9rem;
}

.delete-button {
  background: none;
  padding: 0.3rem;
  color: #aaa;
}

.delete-button:hover {
  color: var(--primary-color);
  background: none;
}

.review-text {
  line-height: 1.5;
  white-space: pre-wrap;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: #aaa;
}
</style> 