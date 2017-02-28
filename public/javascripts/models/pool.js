namespace('Neat.Models')

Neat.Models.Pool = class Pool {
  constructor ({ species = [], generation = 0, innovation = 0, currentSpecies = 0, currentGenome = 0, currentFrame = 0, maxFitness = 0 }) {
    this.species = new Neat.Models.Species({ collection: species })
    this.generation = generation
    this.innovation = innovation || OUTPUTS
    this.currentSpecies = currentSpecies
    this.currentGenome = currentGenome
    this.currentFrame = currentFrame
    this.maxFitness = maxFitness

    this.populate()
  }

  populate () {
    for (let i = 0; i < POPULATION; i++) {
      this.addSpecies(Neat.Models.Genome.basic())
    }
  }

  innovate () {
    return ++this.innovation
  }

  addSpecies (genome) {
    this.species.addGenome(genome)
  }

  getCurrentSpecies () {
    return this.species.at(this.currentSpecies)
  }

  getCurrentGenome () {
    const specie = this.getCurrentSpecies()

    return specie.at(this.currentGenome)
  }

  nextGenome () {
    const specie = this.getCurrentSpecies()

    return specie.at(this.currentGenome + 1)
  }

  nextSpecie () {
    return this.species.at(this.currentSpecies + 1)
  }

  incrementGenome () {
    this.currentGenome++
  }

  incrementSpecies () {
    this.currentSpecies++
    this.currentGenome = 0
  }

  incrementGeneration () {
    this.generation++
    this.currentSpecies = 0
    this.currentGenome = 0
  }

  nextGeneration () {
    this.species.nextGeneration(this.maxFitness)
    this.incrementGeneration()
  }

  next () {
    const genome = this.nextGenome()

    if (genome) {
      this.incrementGenome()

      return genome
    }

    const specie = this.nextSpecie()

    if (specie) {
      this.incrementSpecies()

      return this.getCurrentGenome()
    }

    this.nextGeneration()

    return this.getCurrentGenome()
  }

  toJSON () {
    return {
      species: this.species,
      generation: this.generation,
      innovation: this.innovation,
      currentSpecies: this.currentSpecies,
      currentGenome: this.currentGenome,
      currentFrame: this.currentFrame,
      maxFitness: this.maxFitness
    }
  }
}
