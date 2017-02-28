namespace('Neat.Controllers')

Neat.Controllers.Controller = class Controller {
  constructor (attrs = {}) {
    this.pool = attrs.pool || new Neat.Models.Pool({})
    this.calculateFitness = attrs.calculateFitness
    this.cleanOutput = attrs.cleanOutput
    this.reset = attrs.reset
    this.shouldReset = attrs.shouldReset
    this.getInputs = attrs.getInputs
    this.setOutput = attrs.setOutput
    this.render = attrs.render
    this.advance = attrs.advance
    this.model = this.reset()
  }

  _reset () {
    this.model = this.reset()
  }

  turn () {
    const genome = this.pool.getCurrentGenome()

    this.pool.currentFrame++
    this.inputs = this.getInputs(this.model)
    this.outputs = this.cleanOutput(genome.evaluate(this.inputs))

    for (let button in this.outputs) {
      if (this.outputs[button]) {
        this.setOutput(this.model, button)
      }
    }

    genome.fitness = this.calculateFitness(this.model)

    this.render({
      model: this.model,
      outputs: this.outputs,
      pool: this.pool,
      fitness: genome.fitness
    })

    if (this.shouldReset(this.model)) {
      this._reset()
      this.next()
    } else {
      this.advance(this.model)
    }
  }

  next () {
    const genome = this.pool.getCurrentGenome()

    if (genome.fitness > this.pool.maxFitness) {
      this.pool.maxFitness = genome.fitness
    }

    this.pool.next()
    this.pool.currentFrame = 0
  }

  run () {
    setInterval(() => this.turn(), 100)
  }
}
