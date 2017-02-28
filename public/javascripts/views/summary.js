namespace('Neat.Views')

Neat.Views.Summary = class Inputs {
  constructor ({ el, model }) {
    this.el = el
    this.model = model
  }

  template (pool) {
    const genome = pool.getCurrentGenome()

    return `
      <p class="summary">Generation: ${pool.generation}</p>
      <p class="summary">Species: ${pool.currentSpecies}</p>
      <p class="summary">Genome: ${pool.currentGenome}</p>
      <p class="summary">Fitness: ${genome.fitness}</p>
      <p class="summary">Max Fitness: ${pool.maxFitness}</p>
    `
  }

  render () {
    this.el.innerHTML = this.template(this.model)
  }
}
