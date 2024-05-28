document.addEventListener('DOMContentLoaded', () => {
  const provinciaSelect = document.getElementById('provincia');
  const municipioSelect = document.getElementById('municipio');
  const resultContainer = document.getElementById('result-container');

  // URL de la API Georef para obtener provincias
  const provinciasApiUrl = 'https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=24';

  // Función para cargar provincias
  function loadProvincias() {
      fetch(provinciasApiUrl)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
          })
          .then(data => {
              const provincias = data.provincias;
              provincias.forEach(provincia => {
                  const option = document.createElement('option');
                  option.value = provincia.id;
                  option.textContent = provincia.nombre;
                  provinciaSelect.appendChild(option);
              });
          })
          .catch(error => {
              console.error('Error al obtener las provincias:', error);
              resultContainer.textContent = 'Hubo un error al obtener las provincias.';
          });
  }

  // Función para cargar municipios de una provincia seleccionada
  function loadMunicipios(provinciaId) {
      const municipiosApiUrl = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaId}&campos=id,nombre&max=1000`;

      fetch(municipiosApiUrl)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
          })
          .then(data => {
              municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
              const municipios = data.municipios;
              municipios.forEach(municipio => {
                  const option = document.createElement('option');
                  option.value = municipio.id;
                  option.textContent = municipio.nombre;
                  municipioSelect.appendChild(option);
              });
              municipioSelect.disabled = false;
          })
          .catch(error => {
              console.error('Error al obtener los municipios:', error);
              resultContainer.textContent = 'Hubo un error al obtener los municipios.';
          });
  }

  // Event listener para cuando se selecciona una provincia
  provinciaSelect.addEventListener('change', () => {
      const provinciaId = provinciaSelect.value;
      if (provinciaId) {
          loadMunicipios(provinciaId);
      } else {
          municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
          municipioSelect.disabled = true;
      }
  });

  // Cargar provincias al cargar la página
  loadProvincias();
});
