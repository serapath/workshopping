var workshop = require('workshopping')
var logo = require('play-logo')
var csjs = require('csjs-inject')

module.exports = workshop.config({
  theme = {
    '--lessonBGcolor' : '#0000ff',
    '--arrowColor'    : 'magenta',
    '--titleSize'     : '50px',
  },
  data = {
    title: 'workshop',
    iconURL: null,
    lessons: [{ // example item
      "title"    : "Move Bitcoin from Coinbase to Electrum",
      "learn"    : "https://www.youtube.com/watch?v=9fvDp43rShA",
      "practice" : "",
    }],
  },
  css = csjs`
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
    }
  `
} = {})
