class RandomSignalGenerator {
  constructor(harmonicsNumber, frequencyCutoff, discreteSamplesNumber) {
    this.harmonicsNumber = harmonicsNumber;
    this.frequencyCutoff = frequencyCutoff;
    this.discreteSamplesNumber = discreteSamplesNumber;

    this.signals = [];
  }

  calculateSignal(amplitude, frequency, time, phase) {
    return amplitude * Math.sin(frequency * time + phase);
  }

  generateSignals() {
    let signals = Array(this.discreteSamplesNumber).fill(0);

    for (let i = 1; i <= this.harmonicsNumber; i++) {
      let frequency = (i * this.frequencyCutoff) / this.harmonicsNumber;

      let phase = Math.random();
      let amplitude = Math.random();

      for (let time = 0; time < this.discreteSamplesNumber; time++) {
        let signal = this.calculateSignal(amplitude, frequency, time, phase);
        signals[time] += signal;
      }
    }

    return signals;
  }
}

const mean = (signals) =>
  signals.reduce((prev, curr) => prev + curr, 0) / signals.length;

const variance = (signals) => {
  let Mx = mean(signals);

  return (
    signals
      .map((num) => Math.pow(num - Mx, 2))
      .reduce((prev, curr) => prev + curr, 0) /
    (signals.length - 1)
  );
};

function createComplex(real, imag) {
  return {
    real: real,
    imag: imag,
  };
}

const complexAdd = function (a, b) {
  return [a[0] + b[0], a[1] + b[1]];
};

const complexSubtract = function (a, b) {
  return [a[0] - b[0], a[1] - b[1]];
};

const complexMultiply = function (a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
};

const complexMagnitude = function (c) {
  return Math.sqrt(c[0] * c[0] + c[1] * c[1]);
};

var mapExponent = {},
  exponent = function (k, N) {
    var x = -2 * Math.PI * (k / N);

    mapExponent[N] = mapExponent[N] || {};
    mapExponent[N][k] = mapExponent[N][k] || [Math.cos(x), Math.sin(x)]; // [Real, Imaginary]

    return mapExponent[N][k];
  };

var dft = function (vector) {
  var X = [],
    N = vector.length;

  for (var k = 0; k < N; k++) {
    X[k] = [0, 0]; //Initialize to a 0-valued complex number.

    for (var i = 0; i < N; i++) {
      var exp = exponent(k * i, N);
      var term;
      if (Array.isArray(vector[i])) term = complexMultiply(vector[i], exp);
      //If input vector contains complex numbers
      else term = complexMultiply([vector[i], 0], exp); //Complex mult of the signal with the exponential term.
      X[k] = complexAdd(X[k], term); //Complex summation of X[k] and exponential
    }
  }

  return X;
};

function fft(vector) {
  var X = [],
    N = vector.length;

  // Base case is X = x + 0i since our input is assumed to be real only.
  if (N == 1) {
    if (Array.isArray(vector[0]))
      //If input vector contains complex numbers
      return [[vector[0][0], vector[0][1]]];
    else return [[vector[0], 0]];
  }

  // Recurse: all even samples
  var X_evens = fft(vector.filter(even)),
    // Recurse: all odd samples
    X_odds = fft(vector.filter(odd));

  // Now, perform N/2 operations!
  for (var k = 0; k < N / 2; k++) {
    // t is a complex number!
    var t = X_evens[k],
      e = complexMultiply(exponent(k, N), X_odds[k]);

    X[k] = complexAdd(t, e);
    X[k + N / 2] = complexSubtract(t, e);
  }

  function even(__, ix) {
    return ix % 2 == 0;
  }

  function odd(__, ix) {
    return ix % 2 == 1;
  }

  return X;
}

const compare = (power) => {
  const harmonicsNumber = 8
  const frequencyCutoff = 1200

  let discreteNumber = 2 ** power

  const generator = new RandomSignalGenerator(harmonicsNumber, frequencyCutoff, discreteNumber)
  const signals = generator.generateSignals()

  let t0 = performance.now();
  const dfts = dft(signals)
  let t1 = performance.now();

  const timeDFT = t1 - t0

  t0 = performance.now();
  const ffts = fft(signals)
  t1 = performance.now();

  let timeFFT = t1 - t0
  timeFFT = timeFFT > 0 ? timeFFT : 1

  return timeDFT / timeFFT
}
