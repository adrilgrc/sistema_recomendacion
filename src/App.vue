<template>
  <div id="app">
    <h1>Bienvenido al sistema de recomendación App</h1>

    <div class="content-container">
      <RecommendationMenu @updateMetrics="updateMetrics" />
      <FileReader @fileContentLoaded="updateFileContent" />
    </div>

    <CalculationResults 
      v-if="selectedMetric || selectedPredictionType || fileContent" 
      :selectedMetric="selectedMetric" 
      :selectedPredictionType="selectedPredictionType" 
      :fileContent="fileContent" 
      :numNeighbors="numNeighbors" 
    />
  </div>
</template>

<script>

// Importamos los componentes
import FileReader from './components/FileReader.vue';
import RecommendationMenu from './components/RecommendationMenu.vue';
import CalculationResults from './components/CalculationResults.vue';

export default {
  name: 'App',
  components: {
    FileReader,
    RecommendationMenu,
    CalculationResults,
  },
  data() {
    return {
      selectedMetric: "", // Almacena la métrica seleccionada
      selectedPredictionType: "", // Almacena el tipo de predicción seleccionado
      fileContent: '', // Almacena el contenido del archivo
      numNeighbors: null, // Almacena el número de vecinos
    };
  },
  methods: {
    updateMetrics(metric, predictionType, neighbors) {
      // Actualiza las métricas seleccionadas
      this.selectedMetric = metric;
      this.selectedPredictionType = predictionType;
      this.numNeighbors = neighbors; // Almacena el número de vecinos
    },
    updateFileContent(content) {
      // Actualiza el contenido del archivo
      this.fileContent = content;
    },
  },
};
</script>

<style src="@/styles/style.css"></style> <!-- Importa el CSS global -->
