<template>
  <div>
    <PredictionDisplay
      :numNeighbors="numNeighbors"
      :utilityMatrix="utilityMatrix"
      :similarityMatrix="similarityMatrix"
      :prediction="prediction"
      predictionTypeStr="Matriz de Predicción Simple"
    />
  </div>
</template>

<script>
import { isNumeric } from '@/utils/utils';
import PredictionDisplay from '@/components/PredictionDisplay.vue';

export default {
  components: {
    PredictionDisplay
  },
  props: {
    numNeighbors: {
      type: Number,
      required: true
    },
    utilityMatrix: {
      type: Array,
      required: true
    },
		similarityMatrix: {
			type: Array,
			required: true
		}
	},
	data() {
    return {
      prediction: [],
      flag: false
    };	
	},
	mounted() {
    this.calculateSimplePrediction();
	},
	methods: {
    calculateSimplePrediction() {
      if (this.numNeighbors <= 0 || !isNumeric(this.numNeighbors) || this.numNeighbors > this.utilityMatrix.length - 1) {
        this.flag = true;
        return null;
      }

			const numUsers = this.utilityMatrix.length;
			const numItems = this.utilityMatrix[0].length;
			const prediction = Array.from({ length: numUsers }, () => Array(numItems).fill(0));
      const pares = [];
			for (let i = 0; i < numUsers; i++) {
				for (let j = 0; j < numItems; j++) {
          // Si el usuario ya ha calificado el ítem, no es necesario predecir
          if (this.utilityMatrix[i][j] !== null) {
            prediction[i][j] = this.utilityMatrix[i][j];
            continue;
          }
					const neighbors = this.similarityMatrix[i]
						.map((similarity, u) => ({ similarity, user: u }))
						.filter(({ similarity, user }) => similarity !== null && i !== user) 
						.sort((a, b) => b.similarity - a.similarity)
						.slice(0, this.numNeighbors);
          
					const sumSimilarities = neighbors.reduce((acc, { similarity }) => acc + Math.abs(similarity), 0);
					const sumRatings = neighbors.reduce((acc, {  similarity, user }) => acc + similarity * this.utilityMatrix[user][j], 0);

					prediction[i][j] = sumSimilarities !== 0 ? sumRatings / sumSimilarities : 0;
          if (sumRatings !== 0) {
            pares.push([i, neighbors, sumRatings, sumSimilarities, prediction[i][j], j]);
          }
          
				}
			}

			this.prediction = prediction;
      this.$emit('prediction', this.prediction, pares);
		},
		
	}
};
</script>
