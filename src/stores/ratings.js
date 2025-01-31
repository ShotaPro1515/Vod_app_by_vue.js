import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useRatingsStore = defineStore('ratings', () => {
  const ratings = ref(JSON.parse(localStorage.getItem('movie-ratings')) || {})

  // 評価の変更を監視してローカルストレージに保存
  watch(ratings, (newRatings) => {
    localStorage.setItem('movie-ratings', JSON.stringify(newRatings))
  }, { deep: true })

  // 映画の評価を設定
  const setRating = (movieId, rating) => {
    ratings.value[movieId] = rating
  }

  // 映画の評価を取得
  const getRating = (movieId) => {
    return ratings.value[movieId] || 0
  }

  // 映画の評価を削除
  const removeRating = (movieId) => {
    delete ratings.value[movieId]
  }

  return {
    ratings,
    setRating,
    getRating,
    removeRating
  }
}) 