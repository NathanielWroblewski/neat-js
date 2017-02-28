!function () {
  const app = new Neat.Controllers.Controller({
    reset () {
      return new Neat.Models.Board({
        height: 20,
        width: 10
      })
    },

    shouldReset (model) {
      return model.gameOver
    },

    getInputs (model) {
      return model.getInputs()
    },

    setOutput (model, button) {
      model.movePiece(button)
    },

    advance (model) {
      model.movePiece('drop')
    },

    render ({ model, outputs, pool }) {
      const genome = pool.getCurrentGenome()
      const gameView = new Neat.Views.Inputs({
        el: document.querySelector('.game'),
        model: model,
        game: true
      })
      const inputView = new Neat.Views.Inputs({
        el: document.querySelector('.inputs'),
        model: model,
        game: false
      })
      const networkView = new Neat.Views.Network({
        el: document.querySelector('.network'),
        model: genome
      })
      const outputView = new Neat.Views.Outputs({
        el: document.querySelector('.outputs'),
        model: outputs
      })
      const summaryView = new Neat.Views.Summary({
        el: document.querySelector('.summary'),
        model: pool
      })

      gameView.render()
      inputView.render()
      networkView.render()
      outputView.render()
      summaryView.render()
    },

    calculateFitness (model) {
      const cells = model.getInputs()
      const rowLength = 10
      const numberOfDrops = 20
      let fitness = 1

      for (let i = 0; i < cells.length; i += rowLength) {
        const row = cells.slice(i, i + rowLength)
        const filled = cells.reduce((memo, element) => memo += (element ? 1 : 0), 0)

        fitness += Math.floor(((filled / row.length) * (i + 1)) / numberOfDrops)
      }

      fitness += (model.score * 100)

      return fitness
    },

    cleanOutput (output = {}) {
      const { left, right, drop, rotate } = output

      if (left && right) {
        return { drop, rotate, left: false, right: false }
      } else {
        return output
      }
    },
  })

  app.run()
}()
