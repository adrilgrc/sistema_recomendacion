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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  margin-top: 40px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.content-container > * {
  flex: 1;
  max-width: 400px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}
</style>
