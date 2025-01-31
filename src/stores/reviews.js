import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref(JSON.parse(localStorage.getItem('movie-reviews')) || {})

  // レビューの変更を監視してローカルストレージに保存
  watch(reviews, (newReviews) => {
    localStorage.setItem('movie-reviews', JSON.stringify(newReviews))
  }, { deep: true })

  // レビューを追加または更新
  const setReview = (movieId, review) => {
    if (!reviews.value[movieId]) {
      reviews.value[movieId] = []
    }
    const now = new Date().toISOString()
    reviews.value[movieId].unshift({
      text: review,
      date: now,
      id: `${movieId}-${now}`
    })
  }

  // 映画のレビューを取得
  const getReviews = (movieId) => {
    return reviews.value[movieId] || []
  }

  // レビューを削除
  const removeReview = (movieId, reviewId) => {
    if (reviews.value[movieId]) {
      reviews.value[movieId] = reviews.value[movieId].filter(r => r.id !== reviewId)
      if (reviews.value[movieId].length === 0) {
        delete reviews.value[movieId]
      }
    }
  }

  return {
    reviews,
    setReview,
    getReviews,
    removeReview
  }
}) 