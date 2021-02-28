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

const mean = (signals) => signals.reduce((prev, curr) => prev + curr, 0) / signals.length

const variance = (signals) => {
  let Mx = mean(signals)

  return signals.map((num) => Math.pow(num - Mx, 2))
    .reduce((prev, curr) => prev + curr, 0) / (signals.length - 1)
}

const correlate = (signals1, signals2) => {
  const n = signals1.length
  const M1 = mean(signals1)
  const M2 = mean(signals2)

  let correlation = Array(256).fill(0)

  for (let tau = 0; tau < 256; tau++) {
    for (let t = 1; t < n - tau; t++) {
      correlation[tau] += (signals1[t] - M1) * (signals2[t + tau] - M2)
    }
    correlation[tau] /= (n - 1)
  }

  console.log(correlation[0])
  return correlation
}

const correlateNormal = (signals1, signals2) => {
  const n = signals1.length
  const M1 = mean(signals1)
  const M2 = mean(signals2)

  const V1 = variance(signals1)
  const V2 = variance(signals2)

  let correlation = Array(256).fill(0)

  for (let tau = 0; tau < 256; tau++) {
    for (let t = 1; t < n - tau; t++) {
      correlation[tau] += (signals1[t] - M1) * (signals2[t + tau] - M2)
    }
    correlation[tau] /= Math.sqrt(V1 * V2) * (n - 1)
  }

  console.log(correlation[0])
  return correlation
}