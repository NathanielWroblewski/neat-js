namespace('Neat.Views')

const ARROWS = {
  left: '&#8678;',
  right: '&#8680;',
  drop: '&#8681;',
  rotate: '&#8679;'
}

Neat.Views.Outputs = class Inputs {
  constructor ({ el, model }) {
    this.el = el
    this.model = model
  }

  template (outputs) {
    return BUTTON_NAMES.reduce((html, output) => {
      const enabled = outputs[output]

      return html += `<div class="output enabled-${enabled}">
        ${ARROWS[output]}
      </div>`
    }, '')
  }

  render () {
    this.el.innerHTML = this.template(this.model)
  }
}
