import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const history = ref(JSON.parse(localStorage.getItem('movie-history')) || [])

  // 視聴履歴の変更を監視してローカルストレージに保存
  watch(history, (newHistory) => {
    localStorage.setItem('movie-history', JSON.stringify(newHistory))
  }, { deep: true })

  // 視聴履歴に追加
  const addToHistory = (movie) => {
    // 既存の履歴から同じ映画を削除
    history.value = history.value.filter(m => m.id !== movie.id)
    
    // 新しい履歴を追加
    history.value.unshift({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      watched_at: new Date().toISOString()
    })

    // 最大100件まで保存
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
  }

  // 視聴履歴から削除
  const removeFromHistory = (movieId) => {
    history.value = history.value.filter(m => m.id !== movieId)
  }

  // 視聴履歴をクリア
  const clearHistory = () => {
    history.value = []
  }

  // 最近の視聴履歴を取得
  const getRecentHistory = (limit = 10) => {
    return history.value.slice(0, limit)
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentHistory
  }
}) 