<template>
  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>

    <div v-if="fileContent">
      <!-- Componente que calcula la matriz de similitud -->
      <component
        :is="currentComponent"
        :content="fileContent"
        @matrixComputed="updateMatrices"
      />

      <!-- Componente DifferenceAverage.vue -->
      <!-- Agregar chequeo condicional para asegurar que las matrices no sean undefined -->
      <DifferenceAverage
        v-if="selectedPredictionType === 'meanDifference'"
        :utilityMatrix="utilityMatrix"
        :pearsonMatrix="pearsonMatrix"
        :numNeighbors="numNeighbors" 
      />
    </div>

    <div v-else>
      <p>No hay contenido del archivo disponible.</p>
    </div>
  </div>
</template>

<script>
import PearsonCorrelation from '@/components/CorrelationPearson.vue';
import CosineDistance from '@/components/CosineDistance.vue';
import EuclideanDistance from '@/components/EuclideanDistance.vue';
import DifferenceAverage from '@/components/DifferenceAverage.vue';

export default {
  props: {
    selectedMetric: {
      type: String,
      required: true,
    },
    fileContent: {
      type: String,
      default: '',
    },
    selectedPredictionType: {
      type: String,
      required: true,
    },
    utilityMatrix: {
      type: Array,
      required: false, // Hacer que no sea estrictamente requerido inicialmente
      default: () => [], // Inicializar con un array vacío
    },
    pearsonMatrix: {
      type: Array,
      required: false, // Hacer que no sea estrictamente requerido inicialmente
      default: () => [], // Inicializar con un array vacío
    },
    numNeighbors: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentUtilityMatrix: [],
      currentPearsonMatrix: [],
    };
  },
  computed: {
    currentComponent() {
      switch (this.selectedMetric) {
        case 'pearson':
          return PearsonCorrelation;
        case 'cosine':
          return CosineDistance;
        case 'euclidean':
          return EuclideanDistance;
        default:
          return null;
      }
    },
  },
  components: {
    PearsonCorrelation,
    CosineDistance,
    EuclideanDistance,
    DifferenceAverage,
  },
  methods: {
    updateMatrices({ utilityMatrix, pearsonMatrix }) {
      // Asegurarnos de que las matrices estén bien definidas antes de asignarlas
      if (utilityMatrix && pearsonMatrix) {
        console.log('Utility Matrix:', utilityMatrix);
        console.log('Pearson Matrix:', pearsonMatrix);
        this.currentUtilityMatrix = utilityMatrix; // Asignar a variables locales
        this.currentPearsonMatrix = pearsonMatrix;
      }
    },
  },
};
</script>
