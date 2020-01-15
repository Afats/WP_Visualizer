window.onload = function() {

  // file input
  const file = document.getElementById("file-input");
  const canvas = document.getElementById("canvas");
  const h3 = document.getElementById("song-name")
  const audio = document.getElementById("audio");
  //const h3 = document.getElementById('name')

  file.onchange = function() {

    const files = this.files; // FileList containing File objects selected by the user (DOM File API)
    console.log('FILES[0]: ', files[0])
    audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object

    const name = files[0].name
    h3.innerText = `${name}` // Sets <h3> to the name of the file


    // mute button
    var mute = document.querySelector('.mute');

    ///////// <CANVAS> context INITIALIZATION //////////
    const canvasCtx = canvas.getContext("2d");
    var visualSelect = document.getElementById("visual");

    var intendedWidth = document.querySelector('.wrapper').clientWidth;
    canvas.setAttribute('width',intendedWidth);
    //var drawVisual;
    //canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    ///////////////////////////////////////////


    const audioCtx = new AudioContext(); // Audio-processing graph
    let source = audioCtx.createMediaElementSource(audio); // Give the audio context an audio source,
    const analyser = audioCtx.createAnalyser(); // Create an analyser for audio context
    //change to const?
    //const stream; for mic input?
    //analyser.minDecibels = -90;
    //analyser.maxDecibels = -10;
    //analyser.smoothingTimeConstant = 0.85;


    source.connect(analyser); // Connects audio context source to analyser
    analyser.connect(audioCtx.destination); // End destination of an audio graph in a given context
    // Sends sound to the speakers or headphones

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // audio effects
    //analyser.connect(distortion);
    //var distortion = audioCtx.createWaveShaper();
    //var gainNode = audioCtx.createGain();
    //var biquadFilter = audioCtx.createBiquadFilter();
    //var convolver = audioCtx.createConvolver();

    // work on this later?
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // Analyser node will capture audio data, methods below will copy dara into either an 8-bit or 32-bit array
    // AnalyserNode.minDecibels -- min power value for fft data caling
    // AnalyserNode.maxDecibels -- max power value for fft data scaling
    // AnalyserNode.smoothingTimeConstant -- different data averaging constants
    // AnalyserNode.getFloatFrequencyData() & AnalyserNode.getByteFrequencyData() -- capture frequency data
    // AnalyserNode.getByteTimeDomainData() & AnalyserNode.getFloatTimeDomainData() -- capture waveform data
    // AnalyserNode.frequencyBinCount -- half the fft value

    // capture audio data using fft, depending on fft size (multiples of 2, default is 2048)

    /////////////// ANALYSER FFTSIZE ////////////////////////
    // analyser.fftSize = 32;
    // analyser.fftSize = 64;
    // analyser.fftSize = 128;
    // analyser.fftSize = 256;
    // analyser.fftSize = 512;
    // analyser.fftSize = 1024;
    // analyser.fftSize = 2048;
    // analyser.fftSize = 4096;
    // analyser.fftSize = 8192;
    // analyser.fftSize = 16384;
    // analyser.fftSize = 32768;

    // (FFT) is an algorithm that samples a signal over a period of time
    // and divides it into its frequency components (single sinusoidal oscillations).
    // It separates the mixed signals and shows what frequency is a violent vibration.

    // (FFTSize) represents the window size in samples that is used when performing a FFT

    // Lower the size, the less bars (but wider in size)
    ///////////////////////////////////////////////////////////

    var visualSetting = visualSelect.value;
    console.log(visualSetting);

    if(visualSetting == "frequencybars") {

      // setting up the buffer
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount; // bufferLength is half of fft size -- number of data values to tinker with

      // The FFT size defines the number of bins used for dividing the window into equal strips, or bins.
      // Hence, a bin is a spectrum sample, and defines the frequency resolution of the window.

      console.log(bufferLength);
      const dataArray = new Float32Array(bufferLength); //number of data points we're collecting for the given fft size

      console.log('DATA-ARRAY: ', dataArray)
      // Clear the canvas -- (define width and height)
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      console.log('WIDTH: ', WIDTH, 'HEIGHT: ', HEIGHT);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      function freqBarDraw() {

        // to keep looping the drawing function
        var drawVisual = requestAnimationFrame(freqBarDraw);
        // grab the time donain data
        analyser.getFloatFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        // most frequencies will come back with no audio in them -- therefore 2.5 factor
        var barWidth = (WIDTH / bufferLength) * 2.5;  //(canvas width/no.of bars -> the buffer length)
        console.log('BARWIDTH: ', barWidth)
        var barHeight;
        //draw a bar at x pixels across the canvas
        var x = 0;

        // frequency bar
        // cycling thru dataArray, fill colour based on bar height
        for(var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i]/2; // height based on array value

            canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
            // to draw bars from the bottom up
            canvasCtx.fillRect(x, (HEIGHT-barHeight/2), barWidth, barHeight);

            x += barWidth + 1;
          }
      }

      audio.play();
      freqBarDraw();
    }
  };
};
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // waveform

  //canvasCtx.lineWidth = 2;
  //canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  //canvasCtx.beginPath();

  // divide canvas width by array length (eq. to FreqNin Count)
  //var sliceWidth = WIDTH * 1.0 / bufferLength;
  //var x = 0; // variable to define the position to move to for drawing each sement of the line

  // loop to define the position of a small segment of the wave for each point in the buffer,
  // at a certain height based on the data point value from the array,
  // then moving the line across to the place where the next wave wave segment should be drawn
  /*for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();

        // divide canvas width by array length (eq. to FreqNin Count)
        //var sliceWidth = WIDTH * 1.0 / bufferLength;
        //var x = 0; // variable to define the position to move to for drawing each sement of the line


        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    }; */
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
