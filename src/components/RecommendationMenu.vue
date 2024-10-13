<template>
  <div class="form-container">
    <h2>Selecciona la métrica y el tipo de predicción</h2>
    
    <label for="metric">Métrica elegida:</label>
    <select v-model="selectedMetric" id="metric" class="custom-select" @change="emitSelection">
      <option disabled value="">Selecciona una métrica</option>
      <option value="pearson">1. Correlación de Pearson</option>
      <option value="cosine">2. Distancia coseno</option>
      <option value="euclidean">3. Distancia Euclídea</option>q
    </select>

    <label for="neighbors" >Número de vecinos:</label>
    <input 
      type="number" 
      id="neighbors" 
      v-model="numNeighbors" 
      class="custom-input" 
      min="1" 
      placeholder="Ingresa el número de vecinos"
      @change="emitSelection"
    />

    <label for="predictionType">Tipo de predicción:</label>
    <select v-model="selectedPredictionType" id="predictionType" class="custom-select" @change="emitSelection">
      <option disabled value="">Selecciona un tipo de predicción</option>
      <option value="simple">5. Predicción simple</option>
      <option value="meanDifference">6. Diferencia con la media</option>
    </select>

    <div class="output">
      <h3>Selección actual:</h3>
      <p>Métrica: {{ selectedMetric || 'Ninguna seleccionada' }}</p>
      <p>Número de vecinos: {{ numNeighbors || 'No especificado' }}</p>
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
      numNeighbors: null, // Nueva variable para almacenar el número de vecinos
    };
  },
  methods: {
    emitSelection() {
      // Emitir evento con las selecciones actuales
      this.$emit('updateMetrics', this.selectedMetric, this.selectedPredictionType, this.numNeighbors);
    }
  },
};
</script>

<style scoped>
.form-container {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 40px auto;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

h2 {
  text-align: center;
  color: #2c3e50;
}

label {
  font-weight: bold;
  margin-top: 20px;
  display: block;
  color: #34495e;
}

.custom-select, .custom-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  margin-top: 5px;
  background-color: #ecf0f1;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.custom-select:focus, .custom-input:focus {
  border-color: #2980b9;
  outline: none;
}

.output {
  background-color: #ecf0f1;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

p {
  margin: 5px 0;
}

select:hover, .custom-select:focus {
  background-color: #e0f7fa;
}

h3 {
  color: #2980b9;
}
</style>
