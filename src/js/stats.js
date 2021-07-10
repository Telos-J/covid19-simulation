import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const labels = [];

const infected = {
    label: 'Infected',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [],
    fill: true,
    radius: 0,
    tension: 0.4
  }

const susceptable = {
    label: 'Susceptable',
    backgroundColor: 'rgb(99, 255, 132)',
    borderColor: 'rgb(99, 255, 132)',
    data: [],
    fill: true,
    radius: 0,
    tension: 0.4
  }

const data = {
  labels: labels,
  datasets: [infected, susceptable]
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Real-time data of Covid19'
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Number of humans'
        }
      }
    }
  }
};
const chart = new Chart(
    document.getElementById('chart'),
    config
  );

let x = 0
function updateChart(infectedNum, susceptableNum){
  labels.push(x++)
  infected.data.push(Math.floor(Math.random() * 50))
  susceptable.data.push(Math.floor(Math.random() * 50))
  chart.update()
}

export { chart, infected, susceptable, updateChart }