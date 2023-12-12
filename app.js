document.addEventListener('DOMContentLoaded', async () => {
  const video = document.getElementById('video');
  const startButton = document.getElementById('startButton');
  const temperatureResult = document.getElementById('temperatureResult');

  let faceModel;

  try {
      // Load the Blazeface model for face detection
      faceModel = await blazeface.load();
  } catch (error) {
      console.error('Error loading face detection model:', error.message);
      alert('Failed to load the face detection model. Please check the console for details.');
      return;
  }

  async function startMeasurement() {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;

          // Wait for the 'loadedmetadata' event before attempting to estimate faces
          await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));

          const temperature = await measureTemperature();
          displayTemperatureResult(temperature);
      } catch (error) {
          console.error('Error accessing camera or measuring temperature:', error.message);
          alert('Error accessing camera or measuring temperature. Please check the console for details.');
      }
  }

  async function measureTemperature() {
      try {
          // Use Blazeface for face detection
          const facePredictions = await faceModel.estimateFaces(video);

          if (!facePredictions || facePredictions.length === 0) {
              throw new Error('Face not detected.');
          }

          // Simulate a more realistic temperature estimation
          const temperature = simulateTemperatureEstimation(facePredictions[0]);
          return temperature;
      } catch (error) {
          console.error('Error measuring temperature:', error.message);
          alert('Failed to measure temperature. Please check the console for details.');
          throw error; // Rethrow the error so that it can be caught in the startMeasurement catch block
      }
  }
  
    function simulateTemperatureEstimation(facePrediction) {
      // Simulate temperature estimation based on face prediction.
      // This is a placeholder and should be replaced with a real algorithm or model.
  
      // Extract facial landmarks for more realistic simulation
      const landmarks = facePrediction.landmarks;
  
      // Use multiple landmarks for temperature simulation
      const noseBridge = landmarks[27];
      const rightCheek = landmarks[14];
      const leftCheek = landmarks[2];
  
      // Calculate a weighted average based on the distance between landmarks
      const distanceRight = calculateDistance(noseBridge, rightCheek);
      const distanceLeft = calculateDistance(noseBridge, leftCheek);
      const weightedAverageDistance = (2 * distanceRight + distanceLeft) / 3;
  
      // Simulate a more realistic temperature estimation
      const temperature = 36.5 + (weightedAverageDistance - 50) / 5;
  
      // Add any additional logic for a more realistic simulation
  
      return temperature.toFixed(1);
    }
  
    function calculateDistance(point1, point2) {
      return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
    }
  
    function displayTemperatureResult(temperature) {
      temperatureResult.innerText = `Estimated Temperature: ${temperature}°C`;
    }
  
    startButton.addEventListener('click', () => {
      startMeasurement();
    });
  });
  