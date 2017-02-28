namespace('Neat.Models')

Neat.Models.Gene = class Gene {
  constructor ({ into = 0, out = 0, weight = 0.0, enabled = true, innovation = 0 }) {
    this.into = parseInt(into, 10)
    this.out = parseInt(out, 10)
    this.weight = weight
    this.enabled = enabled
    this.innovation = innovation
  }

  enable () {
    this.enabled = true
  }

  disable () {
    this.enabled = false
  }

  toggle () {
    if (this.enabled) {
      this.disable()
    } else {
      this.enable()
    }
  }

  copy () {
    return new Gene(this.toJSON())
  }

  mutate (step) {
    if (Math.random() < PERTURB_CHANCE) {
      this.weight = this.weight + Math.random() * step * 2 - step
    } else {
      this.weight = Math.random() * 4 - 2
    }
  }

  split (at, innov) {
    this.disable()

    return [
      new Gene({ into: this.into, out: at, weight: 1.0, innovation: innov() }),
      new Gene({ into: at, out: this.out, weight: this.weight, innovation: innov() })
    ]
  }

  toJSON () {
    return {
      into: this.into,
      out: this.out,
      weight: this.weight,
      enabled: this.enabled,
      innovation: this.innovation
    }
  }
}
