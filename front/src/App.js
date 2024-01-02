import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const App = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:8000');

    socket.on('message', (message) => {
      const newData = JSON.parse(message);
      
      //proveri
      setData((prevData) => [...prevData, newData]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  

  useEffect(() => {
    // Formatiranje podataka za grafikon samo ako postoje podaci
    if (data.length > 0) {
      
      const chartLabels = data.map((entry) => {
        const date = new Date(entry.dt * 1000);
        return date.toLocaleDateString('en-GB'); // Formatiraj datum u "dd/MM/yy"

        // const timestamp = entry.dt;
        // const dateObj = new Date();

        // // const hours = dateObj.toLocaleDateString('en-GB',{hour12: false, hour: '2-digit',minute: '2-digit', second: '2-digit'});

        // const hours = dateObj.getHours().toString().padStart(2,'0');
        // const minutes = dateObj.getMinutes().toString().padStart(2,'0');
        // const seconds = dateObj.getSeconds().toString().padStart(2,'0');

        // const formattedTime = `${hours}:${minutes}:${seconds}`;

        

        // return formattedTime;

      });

      
      const chartTemperatureData = data.map((entry) => entry.temperature_celsius);
      
      console.log(data);

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Temperature in Celsius',
            data: chartTemperatureData,
            fill: false,
            borderColor: 'rgba(0,146,255,1)',
            tension: 0.5,
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.1,
              },
            },
          },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      {/* Prikazivanje grafikona samo ako postoje podaci */}
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default App;
