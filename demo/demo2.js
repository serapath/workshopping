const workshop = require('../')
// const logo = require('play-logo')
const csjs = require('csjs-inject')

module.exports = async function demo () {
  const defaults = workshop.defaults
  console.log(defaults)
  var default1 = workshop.customize(workshop.defaults) // default initialised
  var default2 = workshop.customize({}) // default initialised
  var default3 = workshop.customize() // default initialised
  console.log(workshop === default1) // true
  console.log(workshop === default2) // true
  console.log(workshop === default3) // true
  const custom_defaults = { config, theme, css }
  const custom_workshop = workshop.customize(custom_defaults)
  console.log(workshop === custom_workshop) // false
  const overwrite_any_defaults = { config: {}, theme: {}, css: {} }
  return await custom_workshop(/*overwrite_any_defaults*/)
}
const config = {
  // home_text: 'powered by love',
  intro_prefix_text: 'workshop',
}
const theme = {
  '--lessonBGcolor' : '#0000ff',
  '--arrowColor'    : 'magenta',
  '--titleSize'     : '50px',
}
const css = csjs`
.workshop          {
  --lessonBGcolor  : ${theme['--lessonBGcolor']};
  --arrowColor     : ${theme['--arrowColor']};
  --titleSize      : ${theme['--titleSize']};
  box-sizing       : border-box;
  display          : flex;
  flex-direction   : column;
  width            : 100%;
  height           : 100%;

  background-color : green;
}
.navbar            {
  display          : flex;
  width            : 100%;
  margin           : 0;
}
.arrow             {
  background-color : grey;
  font-size        : 150px;
  font-weight      : 900;
  cursor           : pointer;
}
.arrow:hover       {
  background-color : black;
  color            : var(--arrowColor);
}
.status            {
  display          : flex;
  justify-content  : center;
  align-items      : center;
  flex-grow        : 1;
}
.icon              {
  height           : var(--titleSize};
  margin-right     : 10px;
}
.title             {
  font-size        : var(--titleSize};
  font-family      : arial;
  font-weight      : 900;
}
.lesson            {
  display          : flex;
  background-color : var(--lessonBGcolor);
  flex-grow        : 1;
}`
