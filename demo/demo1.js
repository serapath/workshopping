const workshop = require('../')
// const logo = require('play-logo') // @TODO: play-logo + default logo
const csjs = require('csjs-inject')

module.exports = async function demo () {
  console.log(workshop.defaults)
  const overwrite_any_defaults = { config, theme, css }
  return await workshop(overwrite_any_defaults)
}
const config = {
  // home_link: 'http://github.com/ethereum/play',
  // home_text: 'yay! workshopping',
  intro_prefix_text: 'earn while you learn',
}
const theme = {
  menu_padding: '5px 0px',
  menu_and_minimap_and_wide_backgroundColor: 'magenta',
}
const css = { }
