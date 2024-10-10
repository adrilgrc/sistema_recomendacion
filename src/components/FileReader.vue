<template>
  <div class="file-container">
    <h1>Leer Matriz de Utilidad</h1>
    
    <!-- Campo para subir archivo -->
    <label for="file-upload" class="custom-file-upload">
      Seleccionar archivo
    </label>
    <input type="file" id="file-upload" @change="handleFileChange" accept=".txt" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileContent: '', // Aquí se almacenará el contenido del archivo
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]; // Obtener el archivo seleccionado
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.fileContent = e.target.result; // Almacenar el contenido del archivo
          this.$emit('fileContentLoaded', this.fileContent); // Emitir el contenido al padre
        };
        reader.readAsText(file); // Leer el archivo como texto
      }
    },
  },
};
</script>

<style scoped>
/* Estilos del contenedor y del input de archivo */
.file-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

input[type="file"] {
  display: none; /* Ocultar input de archivo */
}

.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-file-upload:hover {
  background-color: #2980b9;
}

.file-output {
  margin-top: 20px;
  text-align: left;
}

h3 {
  color: #34495e;
  margin-bottom: 10px;
}

pre {
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 8px;
  white-space: pre-wrap;
  overflow-x: auto;
}
</style>
