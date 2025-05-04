function toggleDevice(device, isOn) {
    const action = isOn ? 'on' : 'off';
    const statusElement = document.getElementById(`${device}Status`);
    const iconElement = document.querySelector(`#${device}Icon`); // Select icon element by ID
    statusElement.textContent = 'Loading...';
  
    // Replace with your Arduino's IP address or domain
    const arduinoIP = 'http://192.168.222.155'; // Replace with your ESP32 IP
    const url = `${arduinoIP}/control?device=${device}&action=${action}`;
  
    fetch(url)
      .then(response => response.json())  // Parse JSON response
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
  
        // Update status and icons based on response
        statusElement.textContent = data.status;
        if (device === 'light') {
          iconElement.classList.toggle('icon-light-on', isOn);
          iconElement.classList.toggle('icon-light-off', !isOn);
        } else if (device === 'fan') {
          iconElement.classList.toggle('icon-fan-on', isOn);
          iconElement.classList.toggle('icon-fan-off', !isOn);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        statusElement.textContent = 'Error';
        alert(`Error: Unable to reach Arduino to turn ${device} ${action}`);
      });
  }
  
  // Initialize Web Speech API for voice recognition
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  // Define possible commands for each action
  const lightOnCommands = ['turn on the light', 'lights on', 'switch on the light'];
  const lightOffCommands = ['turn off the light', 'lights off', 'switch off the light'];
  const fanOnCommands = ['turn on the fan', 'fan on', 'switch on the fan'];
  const fanOffCommands = ['turn off the fan', 'fan off', 'switch off the fan'];
  
  // Function to handle recognized voice commands
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log('Voice Command:', command);
  
    // Check if command matches any of the on or off commands for light or fan
    if (lightOnCommands.some(phrase => command.includes(phrase))) {
      document.getElementById('lightSwitch').checked = true;
      toggleDevice('light', true);
    } else if (lightOffCommands.some(phrase => command.includes(phrase))) {
      document.getElementById('lightSwitch').checked = false;
      toggleDevice('light', false);
    } else if (fanOnCommands.some(phrase => command.includes(phrase))) {
      document.getElementById('fanSwitch').checked = true;
      toggleDevice('fan', true);
    } else if (fanOffCommands.some(phrase => command.includes(phrase))) {
      document.getElementById('fanSwitch').checked = false;
      toggleDevice('fan', false);
    } else {
      alert('Command not recognized. Please try again.');
    }
  };
  
  // Error handling for voice recognition
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    alert('Error in voice recognition. Please try again.');
  };
  
  // Start voice recognition when the button is clicked
  document.getElementById('startVoiceCommand').addEventListener('click', () => {
    recognition.start();
  });
  
  // Toggle Dark Mode
  const toggleDarkModeButton = document.getElementById('toggleDarkMode');
  toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  