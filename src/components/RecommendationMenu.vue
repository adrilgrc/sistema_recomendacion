<template>
  <div class="form-container">
    <h2>Selecciona la métrica y el tipo de predicción</h2>
    
    <label for="metric">Métrica elegida:</label>
    <select v-model="selectedMetric" id="metric" class="custom-select" @change="emitSelection">
      <option disabled value="">Selecciona una métrica</option>
      <option value="pearson">1. Correlación de Pearson</option>
      <option value="cosine">2. Distancia coseno</option>
      <option value="euclidean">3. Distancia Euclídea</option>
    </select>
    
    <label for="neighbors" >Número de vecinos:</label>
    <input 
      type="number" 
      id="neighbors" 
      v-model.number="numNeighbors" 
      class="custom-input" 
      min="1" 
      placeholder="Ingresa el número de vecinos" 
      @input="emitSelection" 
      :disabled="!selectedMetric"
    />
    
    <label for="predictionType">Tipo de predicción:</label>
    <select 
      v-model="selectedPredictionType" 
      id="predictionType" 
      class="custom-select" 
      @change="emitSelection" 
      :disabled="!numNeighbors"
    >
      <option disabled value="">Selecciona un tipo de predicción</option>
      <option value="simple">1. Predicción simple</option>
      <option value="meanDifference">2. Diferencia con la media</option>
    </select>
    
    <div class="output">
      <h3>Selección actual:</h3>
      <p>Métrica: {{ selectedMetric || 'Ninguna seleccionada' }}</p>
      <p>Número de vecinos: {{ numNeighbors !== null ? numNeighbors : 'No especificado' }}</p>
      <p>Tipo de predicción: {{ selectedPredictionType || 'Ninguna seleccionada' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedMetric: "",
      selectedPredictionType: "",
      numNeighbors: null,
    };
  },
  methods: {
    emitSelection() {
      this.numNeighbors = this.numNeighbors || null;
      this.$emit('updateMetrics', this.selectedMetric, this.selectedPredictionType, this.numNeighbors);
    },
  }
};
</script>

