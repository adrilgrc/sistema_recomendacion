<template>
  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>

    <div v-if="fileContent">
      <!-- Muestra el componente para calcular y mostrar la matriz de similitud -->
      <component :is="currentComponent" :content="fileContent" @matrixComputed="updateMatrices" />

      <!-- Muestra el componente para calcular las predicciones después de la matriz de similitud -->
      <div v-if="utilityMatrix.length && similarityMatrix.length && selectedPredictionType ==='simple'">
        <SimplePrediction :utilityMatrix="utilityMatrix" :similarityMatrix="similarityMatrix" :numNeighbors="numNeighbors" />
      </div>
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
import SimplePrediction from '@/components/SimplePrediction.vue';

export default {
  props: {
    selectedMetric: {
      type: String,
      required: true
    },
    fileContent: {
      type: String,
      default: ''
    },
    numNeighbors: {
      type: Number,
      required: true
    },
    selectedPredictionType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      utilityMatrix: [],
      similarityMatrix: []
    };
  },
  computed: {
    currentComponent() {
      switch (this.selectedMetric) {
        case 'pearson':
          return 'PearsonCorrelation';
        case 'cosine':
          return 'CosineDistance';
        case 'euclidean':
          return 'EuclideanDistance';
        default:
          return null;
      }
    }
  },
  components: {
    PearsonCorrelation,
    CosineDistance,
    EuclideanDistance,
    SimplePrediction
  },
  methods: {
    updateMatrices({ utilityMatrix, pearsonMatrix, cosineMatrix, euclideanMatrix }) {
      this.utilityMatrix = utilityMatrix;
      switch (this.selectedMetric) {
        case 'pearson':
            this.similarityMatrix = pearsonMatrix;
            break;
          case 'cosine':
            this.similarityMatrix = cosineMatrix;
            break;
          case 'euclidean':
            this.similarityMatrix = euclideanMatrix;
            break;
          default:
            this.similarityMatrix = [];
      }

      this.$emit('matrixUpdated', { utilityMatrix: this.utilityMatrix, similarityMatrix: this.similarityMatrix });
    }
  }
};
</script>
