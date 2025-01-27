import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])

  // お気に入りの変更を監視してローカルストレージに保存
  watch(favorites, (newFavorites) => {
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }, { deep: true })

  // 映画をお気に入りに追加
  const addFavorite = (movie) => {
    if (!favorites.value.some(f => f.id === movie.id)) {
      favorites.value.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      })
    }
  }

  // お気に入りから映画を削除
  const removeFavorite = (movieId) => {
    favorites.value = favorites.value.filter(f => f.id !== movieId)
  }

  // 映画がお気に入りに含まれているか確認
  const isFavorite = (movieId) => {
    return favorites.value.some(f => f.id === movieId)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  }
}) 