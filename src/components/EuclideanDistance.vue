<template>
  <div>
    <h4>Distancia Euclídea: <strong>{{ euclideanDistance }}</strong></h4>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      euclideanDistance: null
    };
  },
  mounted() {
    this.calculateEuclideanDistance();
  },
  methods: {
    calculateEuclideanDistance() {
      const rows = this.content.trim().split('\n');
      const userRows = rows.slice(2);
      const xValues = [];
      const yValues = [];

      userRows.forEach(row => {
        const values = row.split(' ').map(val => (val === '-' ? null : Number(val)));
        if (!values.includes(null)) {
          xValues.push(values[0]);
          yValues.push(values[1]);
        }
      });

      if (xValues.length === 0 || yValues.length === 0) {
        this.euclideanDistance = 'Error en los datos o no suficientes datos válidos';
        return;
      }

      const distance = Math.sqrt(
        xValues.reduce((sum, x, i) => sum + Math.pow(x - yValues[i], 2), 0)
      );

      this.euclideanDistance = distance.toFixed(4);
    }
  }
};
</script>

