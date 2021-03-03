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

// На самом деле это ковариация, просто исходя из терминов в методичке, было написано что это корреляция.
// Довольно часто в анлоязычной литературе под понятие ковариации подставляют корреляцию, а вместо привычной нам
//   корреляции -- "нормированую" корреляцию. 

// (Выдержка из википедии: It is common practice in some disciplines (e.g. statistics and time series analysis) 
//   to normalize the cross-correlation function to get a time-dependent Pearson correlation coefficient. 
// However, in other disciplines (e.g. engineering) the normalization is usually dropped and the terms "cross-correlation" and 
//  "cross-covariance" are used interchangeably.)

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

// Описанная раньше нормированная корреляция:
// Описание разницы с anomaly.io: 

// Normalized Cross-Correlation
// There are three problems with cross-correlation:
// It is difficult to understand the scoring value.
// Both metrics must have the same amplitude. If Graph B has the same shape as Graph A but values two times smaller, the correlation will not be detected.
// Due to the formula, a zero value will not be taken into account.
// To solve these problems we use normalized cross-correlation:

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