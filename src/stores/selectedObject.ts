import { defineStore } from 'pinia'
import { ref } from 'vue'

type SelectedObject = string | null

export const useSelectedObjectStore = defineStore('selectedObject', () => {
  const selectedObject = ref<SelectedObject>(null)

  function setSelectedObject(id: string) {
    selectedObject.value = id
  }

  function clearSelectedObject() {
    selectedObject.value = null
  }

  return {
    selectedObject,
    setSelectedObject,
    clearSelectedObject
  }
}) 