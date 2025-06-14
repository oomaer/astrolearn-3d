<template>
  <div class="fixed inset-0 flex items-center justify-center p-4">
    <!-- Score Screen -->
    <div v-if="showScore" class="bg-gray-800/70 backdrop-blur-md p-12 rounded-lg shadow-2xl max-w-2xl w-full">
      <h2 class="text-3xl font-bold mb-6 text-center text-white">Quiz Complete!</h2>
      <p class="text-2xl mb-8 text-center text-white">
        Your score: {{ score }} out of {{ quizData.length }}
      </p>
      <div class="flex flex-col gap-4">
        <button
          @click="handleRestart"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg shadow-lg"
        >
          Try Again
        </button>
        <button
          @click="handleBack"
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded text-lg shadow-lg"
        >
          Back to Home
        </button>
      </div>
    </div>

    <!-- Quiz Screen -->
    <div v-else class="bg-gray-800/70 backdrop-blur-md p-12 rounded-lg shadow-2xl max-w-2xl w-full">
      <div class="mb-6">
        <span class="text-gray-300 text-lg">
          Question {{ currentQuestion + 1 }} of {{ quizData.length }}
        </span>
      </div>
      
      <h2 class="text-2xl font-bold mb-8 text-white">
        {{ quizData[currentQuestion].question }}
      </h2>

      <div class="space-y-6">
        <button
          v-for="(option, index) in quizData[currentQuestion].options"
          :key="index"
          @click="handleAnswerClick(index)"
          :disabled="selectedAnswer !== null"
          :class="[
            'w-full text-left p-6 rounded-lg transition-colors border-2 text-lg text-white shadow-md',
            selectedAnswer !== null && index === quizData[currentQuestion].answer
              ? 'border-green-500 bg-gray-700/70'
              : selectedAnswer === index
                ? 'border-red-500 bg-gray-700/70'
                : 'border-transparent bg-gray-700/70 hover:bg-gray-600/70'
          ]"
        >
          {{ option }}
        </button>
      </div>

      <div class="mt-8 w-full">
        <button
          @click="handleNext"
          :disabled="selectedAnswer === null"
          :class="[
            'w-full text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-lg',
            selectedAnswer === null
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          ]"
        >
          {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { quizData } from '../data/quizData'

const router = useRouter()
const currentQuestion = ref(0)
const score = ref(0)
const showScore = ref(false)
const selectedAnswer = ref<number | null>(null)

const isLastQuestion = computed(() => currentQuestion.value === quizData.length - 1)

const handleAnswerClick = (answerIndex: number) => {
  selectedAnswer.value = answerIndex
  
  if (answerIndex === quizData[currentQuestion.value].answer) {
    score.value++
  }
}

const handleNext = () => {
  if (isLastQuestion.value) {
    showScore.value = true
  } else {
    currentQuestion.value++
    selectedAnswer.value = null
  }
}

const handleRestart = () => {
  currentQuestion.value = 0
  score.value = 0
  showScore.value = false
  selectedAnswer.value = null
}

const handleBack = () => {
  router.push('/')
}
</script> 