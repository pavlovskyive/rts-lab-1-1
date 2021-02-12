class RandomSignalGenerator {
  constructor(harmonicsNumber, frequencyCutoff, discreteSamplesNumber) {
    this.harmonicsNumber = harmonicsNumber;
    this.frequencyCutoff = frequencyCutoff;
    this.discreteSamplesNumber = discreteSamplesNumber;

    this.signals = this.generateSignals();
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

  get mean() {
    return this.signals.reduce((prev, curr) => prev + curr, 0) / this.signals.length
  }

  get variance() {
    return this.signals.map((num) => 
      Math.pow(num - this.mean, 2)
    ).reduce((prev, curr) => prev + curr, 0) / (this.signals.length - 1)
  }
}