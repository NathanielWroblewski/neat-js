namespace('Neat.Models')

Neat.Models.Genes = class Genes {
  constructor ({ genes = [] }) {
    this.collection = genes
  }

  getLength () {
    return this.collection.length
  }

  sort () {
    const genes = this.collection.sort((a, b) => a.out - b.out);

    return new Genes({ genes })
  }

  enabled () {
    const genes = this.collection.filter(gene => gene.enabled)

    return new Genes({ genes })
  }

  disabled () {
    const genes = this.collection.filter(gene => !gene.enabled)

    return new Genes({ genes })
  }

  each (fn) {
    return this.collection.forEach(fn)
  }

  map (fn) {
    return this.collection.map(fn)
  }

  reduce (fn, memo) {
    return this.collection.reduce(fn, memo)
  }

  any (fn) {
    for (let i = 0; i < this.collection.length; i++) {
      if (fn(this.at(i))) {
        return true
      }
    }
    return false
  }

  io () {
    const results = new Set(IO)

    this.each(gene => {
      results.add(gene.into)
      results.add(gene.out)
    })

    return [...results]
  }

  containsLink (into, out) {
    return this.any(gene => gene.into === into && gene.out === out)
  }

  add (gene) {
    this.collection.push(gene)
  }

  concat (genes) {
    this.collection = this.collection.concat(genes)
  }

  at (index) {
    return this.collection[index]
  }

  sample () {
    const randomIndex = Math.floor(Math.random() * this.collection.length)

    return this.at(randomIndex)
  }

  innovations () {
    return this.collection.reduce((memo, gene) => {
      memo[gene.innovation] = gene
      return memo
    }, {})
  }

  disjoint (genes) {
    const innovations1 = this.innovations()
    const innovations2 = genes.innovations()
    let count = 0;

    this.each(gene => {
      if (!innovations2[gene.innovation]) {
        count++
      }
    })

    genes.each(gene => {
      if (!innovations1[gene.innovation]) {
        count++
      }
    })

    return count / Math.max(this.getLength(), genes.getLength())
  }

  weights (genes) {
    const i2 = {}
    genes.each(gene => i2[gene.innovation] = gene) // reduce but not true/false

    let sum = 0
    let coincident = 0

    this.each(gene => {
      if (i2[gene.innovation]) {
        let gene2 = i2[gene.innovation]
        sum += Math.abs(gene.weight - gene2.weight)
        coincident++
      }
    })

    return sum / coincident
  }
}
