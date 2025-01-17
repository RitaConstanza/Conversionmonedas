const input = document.getElementById("input");
const select = document.getElementById("selector");
const boton= document.getElementById("btn");
const resultado = document.getElementById("resultado");
let miTabla;

const obtenerDatos = async (moneda) => {
  try {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await res.json();
    return data;
  } catch (error) {
    resultado.innerHTML = `Algo salió mal! Error: ${error.message}`;
  }
};

boton.addEventListener("click", async()=>{
    boton.disabled = true;
    try{
        const monto = input.value;
        const infoIntercambio = await obtenerDatos(`${select.value}`);
        const TipoCambio = infoIntercambio.serie[0].valor;
        const cambio = (monto/ TipoCambio).toFixed(2);
        resultado.innerHTML = `Resultado: ${cambio}`;
        await renderGrafico(select.value);

    }catch(error)
    {
        resultado.innerHTML = error;
    } finally {
        boton.disabled = false;
      }
});

const Informacion = async () => {
    const data = await obtenerDatos(`${select.value}`);
    const labels = data.serie
      .map((moneda) => new Date(moneda.fecha).toLocaleDateString("es-CL"))
      .reverse();
    const values = data.serie.map((moneda) => moneda.valor).reverse();
    const datasets = [
        {
          label: `Valor ${select.value.toUpperCase()}`,
          backgroundColor: "rgba(216, 191, 216, 0.5)",
          borderColor: "#33006F", 
          data: values, 
          fill: true,
        },
      ];
  
      return { labels, datasets }; 
  };
  const renderGrafico = async () => {
    const data = await Informacion();
  
    if (miTabla) {
        miTabla.destroy();
      }
    
      const config = {
        type: "line",
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Fecha",
              },
            },
            y: {
              title: {
                display: true,
                text: "Valor",
              },
            },
          },
        },
      };
    
   
    const canvas = document.getElementById('grafico');
    const ctx = canvas.getContext('2d'); 
    miTabla = new Chart(ctx, config);
}