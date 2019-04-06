const csjs = require('csjs-inject')
const bel = require('bel') // @TODO: replace with `elb`
const belmark = require('belmark') // @TODO: replace with `elbmark`
const skilltree = require('skilltrees')

const getURL = require('_get-url')
const svg2favicon = require('_svg2favicon')

const CONFIG = default_config()
const THEME = default_theme()
const CSS = default_css()

module.exports = workshopping
module.exports.customize = customize
module.exports.defaults = Object.freeze({
  config: CONFIG,
  theme: THEME,
  css: CSS
})
Object.freeze(module.exports)

async function workshopping ({ config = {}, theme = {}, css = {} } = {}) {
  return await _workshopping({
    config: { ...CONFIG, ...config },
    theme: { ...THEME, ...theme },
    css: { ...CSS, ...css }
  })
}
function customize ({ config: x = {}, theme: y = {}, css: z = {} } = {}) {
  const nocustoms = ![x, y, z].reduce((_, o) => Object.keys(o).length || _, 0)
  const isdefault = x === CONFIG && y === THEME && z === CSS
  if (nocustoms || isdefault) return workshopping
  const _CONFIG = { ...CONFIG, ...x }
  const _THEME = { ...THEME, ...y }
  const _CSS = { ...CSS, ...z }
  const custom = async ({ config = {}, theme = {}, css = {} } = {}) => {
    const { config: CONFIG, theme: THEME, css: CSS } = custom.defaults
    return await _workshopping({
      config: { ...CONFIG, ...config },
      theme: { ...THEME, ...theme },
      css: { ...CSS, ...css }
    })
  }
  // @TODO: () => customize // so `custom.customize()` can be a thing? :-)
  custom.defaults = Object.freeze({
    config: _CONFIG,
    theme: _THEME,
    css: _CSS
  })
  Object.freeze(custom)
  return custom
}
/******************************************************************************
  WORKSHOPPING
******************************************************************************/
async function _workshopping ({ config, theme, css }) {
  const href = new URL('./workshop.json', location.href).href
  const data = await fetch(href).then(response => response.json())

  // @TODO: validate workshop "data" and if errors:
  // create and return "error element" with useful "error messages"
  // e.g. if (!lessons || lessons.length === 0) throw new Error('no lessons found')

  // @TODO: store "DEFAULTS" in default objects, so that data passed to:
  // _workshopping() is already in "perfect state"

  var font_url = theme['--font']
  var css = styles(font_url || 'arial', theme)

  var lessons = data.lessons
  var chat = data.chat || 'https://gitter.im/wizardamigosinstitute/program/~embed'

  var video = iframe(lessons[0].lesson, css.video)
  var editor = iframe(lessons[0].tool, css.editor)
  var gitter = iframe(chat, css.gitter)
  var title = bel`<div title=${lessons[0].title} class=${css.title}>${lessons[0].title}</div>`
  var logo_url = data.icon

  var home = config.home_link
  var home_text = config.home_text
  var intro_prefix_text = config.intro_prefix_text

  var lesson = 0
  var series = bel`<span class=${css.series}>"${data.title.trim()}"</span>`

  var chatBox = bel`<div class=${css.chatBox}>
    <div style="width: 100%; height: 100%; flex-grow: 1; display: flex; justify-content: center; align-items: center">
      ... loading support chat ..."
    </div>
    ${gitter}
  </div>`

  async function getMarkdown (lessonInfo) {
    if (typeof lessonInfo !== 'string') var info = belmark(lessonInfo.join('\n'))
    else {
      var infoMarkdown = await fetch(lessonInfo).then(response => response.text())
      var info = belmark(infoMarkdown)
    }
    return info
  }

  if (lessons[0].info) {
    var info = await getMarkdown(lessons[0].info)
  } else {
    var info = belmark`no description`
  }
  info.className = ` ${css.welcome}`
  var infoBox = bel`<div class=${css.infoBox}>${info}</div></div>`
  var view = 'info'

  svg2favicon.makeSVGicon(logo_url, (err, svgURL) => svg2favicon.setFavicon(svgURL))

  var logo = logo_url ? bel`<a href=${home} target="_blank">
    <img class="${css.logo} ${css.img}" title="${home_text}" src="${logo_url}">
  </a>` : ''

  var stats = bel`<span class=${css.stats}>${lesson + 1}/${lessons.length}</span>`
  var infoButton = bel`<div class="${css.infoViewButton} ${css.button}" title='infoButton' onclick=${changeView}>
    Info
  </div>`
  // @TODO: allow `vendor-workshop` to add his logo as a "home" button
  // ${logo}
  var chatButton = bel`<div class="${css.chatViewButton} ${css.button}" title='chatButton' onclick=${changeView}>
    Chat
  </div>`

  var skilltree_element = bel`<div class=${css.curriculum}>
    ${await skilltree(data, href)}
  </div>`
  var skilltreeOpen = false

  async function toggleSkilltree () {
    if (skilltreeOpen) {
      map.removeChild(skilltree_element)
      skilltreeOpen = false
    } else {
      // var el = bel`<span id="skilltree" style="position: absolute; top: 90px; left: 5px; padding: 40px; background-color: pink; border: 5px dashed white;">
      //   <span style="position: absolute; right:20px; top: 10px;">
      //     <a href="https://play.ethereum.org" target="_blank">${'->'} skilltree</a>
      //   </span>
      //   <a href="${location.href}">${data.title}</a>
      //   <ul>
      //     <li><strong>needs</strong><ul>
      //       ${data.needs.map(url => bel`<li>${'->'} <a href="${url}" target="_blank">${url}</a></li>`)}
      //     </ul></li>
      //     <li><strong>unlocks</strong><ul>
      //       ${data.unlocks.map(url => bel`<li>${'->'} <a href="${url}" target="_blank">${url}</a></li>`)}
      //     </ul></li>
      //   </ul>
      // </span>`
      map.appendChild(skilltree_element)
      skilltreeOpen = true
    }
  }
  var narrow, wide, top, bottom, map, prevEl, nextEl, app = bel`
    <div class="${css.content}">
      <div class=${css.menu}>
        <div class=${css.minimap} onclick=${toggleSkilltree}>
          <span><input class=${css.minimapButton} title="Skill tree" type="image" src="${data.icon}"></span>
          ${map = bel`<div class=${css.map}></div>`}
        </div>
        <span class=${css.head}>
          <span class=${css.banner}>${intro_prefix_text} ${series}</span>
        </span>
      </div>
      <div class=${css.container}>
        ${narrow = bel`<div class=${css.narrow}>
          ${top = bel`<div class=${css.top}>
            <div class=${css.switchButtons}>
              ${prevEl = bel`<div class="${css.previous} ${css.disabled}" title="Previous lesson" onclick=${previous}> ${'<'} </div>`}
              ${nextEl = bel`<div class="${css.next} ${lessons.length ? '' : css.disabled}" title="Next lesson" onclick=${next}> ${'>'} </div>`}
              <div class=${css.lesson}>${title} ${stats}</div>
            </div>
            ${video}
          </div>`}
          ${bottom = bel`<div class=${css.bottom}>
            <div class=${css.switchButtons}>
              ${infoButton}
              ${chatButton}
            </div>
            ${infoBox}
          </div>`}
        </div>`}
        ${wide = bel`<div class=${css.wide}>
          ${editor}
        </div>`}
      </div>
    </div>
  `

  window.addEventListener('keyup', function (event) {
    var left = 37
    var right = 39
    if (event.which === left) previous()
    else if (event.which === right) next()
  })
  adaptView(1, lessons.length, lessons[0])

  return app

  async function previous (event) {
    if (lesson <= 1) prevEl.classList.add(css.disabled)
    lesson--
    adaptView(lesson + 1, lessons.length, lessons[lesson])
    nextEl.classList.remove(css.disabled)
  }
  async function next (event) {
    if (lesson >= lessons.length - 2) nextEl.classList.add(css.disabled)
    lesson++
    adaptView(lesson + 1, lessons.length, lessons[lesson])
    prevEl.classList.remove(css.disabled)

  }

  async function adaptView (number, max, { title: name, tool, lesson, info: text }) {
    // TOOL
    if (tool) {
      var nextTool = iframe(tool, css.editor)
      var oldTool = wide.children[0]
      oldTool.replaceWith(nextTool)
      bottom.style = ''
      narrow.appendChild(bottom)
      wide.style = ''
      narrow.style = ''
    } else {
      wide.style.width = '49%'
      narrow.style.width = '49%'
      bottom.style.marginTop = '0px'
      var nextTool = bottom
      wide.children[0].replaceWith(nextTool)
    }
    // LESSON
    var old = video
    video = iframe(lesson, css.video)
    old.parentElement.replaceChild(video, old)
    // TITLE
    stats.innerText = `${number}/${max}`
    title.innerText = name || ''
    title.title = title.innerText
    // INFO
    if (text) {
      info.innerText = ''
      info.appendChild(await getMarkdown(text))
    } else {
      info.innerText = ''
      info.appendChild(belmark`no description`)
    }
  }

  function iframe (src, classname) {
    return bel`<iframe
      class="${classname} ${css.iframe}"
      src="${src}"
      frameborder="0"
      allowfullscreen
    ></iframe>`
  }

  function changeView (e) {
    var parent = document.querySelector(`.${css.bottom}`)
    if (e.target.title === 'infoButton') {
      infoButton.classList.add(css.highlight)
      chatButton.classList.remove(css.highlight)
      if (view != 'info') {
        parent.removeChild(chatBox)
        parent.appendChild(infoBox)
        return view = 'info'
      }
    }
    if (e.target.title === 'chatButton') {
      infoButton.classList.remove(css.highlight)
      chatButton.classList.add(css.highlight)
      if (view != 'chat') {
        parent.removeChild(infoBox)
        parent.appendChild(chatBox)
        return view = 'chat'
      }
    }
  }

  function showChat () {
    var parent = document.querySelector(`.${css.narrow}`)
    parent.removeChild(infoBox)
    parent.appendChild(chatBox)
  }

}

function styles (font_url, theme) {
  var FONT = font_url.split('/').join('-').split('.').join('-').split(':').join('-').split('?').join('-').split('=').join('-')
  var font = bel`
    <style>
    @font-face {
      font-family: ${FONT};
      ${FONT !== font_url ? `src: url('${getURL(font_url)}');` : ''}
    }
    </style>`
  document.head.appendChild(font)

  var others = { ...THEME, ...theme }
  var css = csjs`
    *, *:before, *:after { box-sizing: inherit; }
    .img { box-sizing: content-box; }
    .iframe { border: 0; height: 100%; }
    .content {
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .menu {
      display: flex;
      align-items: center;
      min-height: ${others.menu_minHeight};
      height: ${others.menu_height};
      padding: ${others.menu_padding};
      justify-content: space-between;
      border: ${others.menu_border};
      background-color: ${others.menu_and_minimap_and_wide_backgroundColor};
    }
    .container {
      display: flex;
      background-color: ${others.container_backgroundColor};
      border: ${others.container_border};
      border-top: none;
      flex-grow: 1;
      min-height: 0%;
    }
    .previous, .next {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 40px;
      height: 40px;
      line-height: 100%;
      font-size: calc(20px + 0.3vw);
    }
    .previous:hover, .next:hover {
      color: ${others.arrow_hover_textcolor};
    }
    .disabled {
      visibility: hidden;
    }
    .lesson {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      align-items: center;
      min-width: 50%;
      max-width: 100%;
      height: 40px;
      padding: 0 2%;
      border-left: ${others.lesson_borderleft};
      overflow: hidden;
    }
    .head {
      margin: 0 5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: black;
      font-family: ${FONT};
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: ${others.head_textsize};
      font-weight: ${others.head_textweight};
    }
    .button:hover {
      background-color: ${others.button_hover_backgroundColor};
      color: ${others.button_hover_color};
    }
    .highlight {
      background-color: white;
      color: purple;
    }
    .logo {
      margin-right: 20px;
      width: 50px;
      height: 50px;
    }
    .logo:hover {
      opacity: 0.9;
      cursor: pointer;
    }
    .banner {
      display: flex;
      align-items: center;
      height: 100%;
      font-family: ${FONT};
    }
    .stats {
      display: flex;
      align-self: center;
    }
    .series {
      display: flex;
      align-self: center;
      padding-right: ${others.series_paddingRight};
      cursor: default;
      justify-content: center;
      padding-left: ${others.series_paddingLeft};
      color: ${others.series_textcolor};
      font-size: ${others.series_textsize};
      font-weight: 900;
      white-space: nowrap;
      padding-top: 3px;
    }
    .minimapButton {
      border: ${others.minimapbutton_border};
      border-radius: 50%;
      cursor: pointer;
      padding: 5px;
      margin-left: 20px;
      width: 50px;
      height: 50px;
    }
    .minimap {
      background-color: ${others.menu_and_minimap_and_wide_backgroundColor};
      width: 30px;
      height: 30px;
      margin-left: 2%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .curriculum {
      background-color: white;
      border: 5px dashed black;
    }
    .map {
      position: absolute;
      top: 45px;
      left: 20px;
      margin: 0;
    }
    .wide {
      margin: 1%;
      display: flex;
      flex-direction: column;
      width: 70%;
      background-color: ${others.menu_and_minimap_and_wide_backgroundColor};
    }
    .narrow {
      margin: 1%;
      width: 27%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .editor {
      width: 100%;
      height: 100%;
      border: ${others.editor_border};
    }
    .video {
      width: 100%;
      height: 100%;
      border: ${others.video_border};
      border-top: ${others.video_borderTop};
    }
    .title {
      color: ${others.lesson_title_textcolor};
      font-size: ${others.lesson_title_textsize};
      cursor: default;
      margin-right: 2%;
      width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .top {
      display: flex;
      height: 50%;
      flex-direction: column;
      flex-grow: 1;
    }
    .bottom {
      display: flex;
      height: 50%;
      flex-direction: column;
      margin-top: ${others.bottom_marginTop};
      flex-grow: 1;
    }
    .switchButtons {
      display: flex;
      width: 100%;
      flex-direction: row;
      font-size: ${others.switchbutton_fontsize};
      background-color: ${others.switchbutton_backgroundColor};
      color: ${others.switchbutton_color};
      border: none;
      font-family: ${FONT};
      font-weight: 900;
      height: 40px;
    }
    .button {
      cursor: pointer;
      width: 100px;
      height: 100%;
      font-size: 75px;
      font-weight: 900;
      font-family: ${FONT};
      border: none;
      color: ${others.tab_color};
    }
    .infoViewButton,
    .chatViewButton {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      font-size: ${others.tab_fontsize};
      border: ${others.tab_border};
      width: 50%;
      height: 40px;
      background-color: ${others.tab_backgroundColor};
      text-transform: ${others.tab_textTransform};
    }
    .infoViewButton {
      border-right: ${others.infobutton_borderright};
    }
    .chatViewButton {
      border-left: ${others.chatbutton_borderleft};
    }
    .infoViewButton:hover,
    .chatViewButton:hover {
      background-color: ${others.tab_hover_backgroundColor};
      color: ${others.tab_hover_textcolor};
    }
    .infoBox {
      background-color: ${others.infobox_backgroundColor};
      border-top: ${others.infobox_borderTop};
      margin-top: ${others.infobox_marginTop},
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      font-family: ${FONT};
      overflow-y: auto;
      flex-grow: 1;
    }
    .chatBox {
      position: relative;
      background-color: white;
      width: 100%;
      display: flex;
      align-items: center;
      font-family: ${FONT};
      overflow-y: auto;
      flex-grow: 1;
      border-top: ${others.chatbox_borderTop};
    }
    .gitter {
      position: absolute;
      align-self: flex-start;
      width: 166.4%;
      height: 176.5%;
      transform: translate(-19.95%, -23.35%) scale(0.6);
    }
    .welcome code {
      white-space: pre-wrap;
      font-family: ${FONT};
    }
    .welcome {
      font-size: ${others.welcome_font_size};
      padding: 0 ${others.welcome_padding_topBottom};
      color: ${others.welcome_text_color};
    }`
  return css
}
function default_config () {
  // @TODO: cache it locally instead of re-render and compare performance
  return Object.freeze({ config: '@TODO: make available' })
}
function default_theme () {
  // @TODO: cache it locally instead of re-render and compare performance
  var colors = {
  //    white: "#ffffff", // borders, font on input background
  /**/    themeColor1: "#ffffff", //background white
  //    themeColor1Smoke: '#21252b',  // separators
  //    whiteSmoke: "#f5f5f5", // background light
  /**/    lavenderGrey: "#00ffff", // inputs background
  //    slateGrey: "#8a929b", // text
  //    violetRed: "#b25068",  // used as red in types (bool etc.)
  //    aquaMarine: "#90FCF9",  // used as green in types (bool etc.)
  //    turquoise: "#14b9d5",
  //    yellow: "#F2CD5D",
  /**/    androidGreen: "#ff00ff"
  }
  return Object.freeze({
    menu_minHeight: '90px',
    menu_height: '10%',
    menu_border: '5px solid #d6dbe1',

    menu_and_minimap_and_wide_backgroundColor: colors.themeColor1,

    container_backgroundColor: '#43409a',
    container_border: '5px solid #d6dbe1',
    arrow_hover_textcolor: colors.lavenderGrey,
    lesson_borderleft: `2px solid ${colors.themeColor1}`,
    head_textsize: '30px',
    head_textweight: '900',
    button_hover_backgroundColor: '#43409a',
    button_hover_color: 'inherit',
    series_paddingRight: '10px',
    series_paddingLeft: '2%',
    series_textcolor: 'black',
    series_textsize: '30px',
    minimapbutton_border: `1.5px solid ${colors.androidGreen}`,

    // minimap_backgroundColor: colors.themeColor1,

    editor_border: '5px solid #d6dbe1',
    lesson_title_textcolor: 'grey',
    lesson_title_textsize: '25px',
    video_border: '5px solid #d6dbe1',
    video_borderTop: '5px solid #d6dbe1',
    bottom_marginTop: '2%',
    switchbutton_fontsize: `calc(10px + 0.3vw)`,
    switchbutton_backgroundColor: '#ffd399',
    switchbutton_color: colors.themeColor1,
    tab_color: 'white',
    tab_fontsize: '20px',
    infobutton_borderright: `invalid`, // doesnt touch it
    chatbutton_borderleft: `invalid`, // doesnt touch it
    tab_border: `5px solid #d6dbe1`,
    tab_backgroundColor: '#ffd399',
    tab_textTransform: 'uppercase',
    tab_hover_backgroundColor: 'white',
    tab_hover_textcolor: '#43409a',
    infobox_backgroundColor: 'white',
    infobox_borderTop: `0`,
    infobox_marginTop: `calc(7px)`,
    chatbox_borderTop: `0`,
    welcome_font_size: 'calc(10px + 0.3vw)',
    welcome_padding_topBottom: '10%',
    welcome_text_color: '#43409a'
  })
}
function default_css () {
  // @TODO: cache it locally instead of re-render and compare performance
  return Object.freeze({ css: '@TODO: make available' })
}
