import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

const spin = Styles.keyframes({
  "to": {
    "-webkit-transform": "rotate(360deg)"
  }
});

export const spinnerStyle = Styles.style({
  display: "inline-block",
  width: "2.5rem",
  height: "2.5rem",
  border: "3px solid transparent",
  borderRadius: "50%",
  borderTopColor: Theme.colors.primary.main,
  borderRightColor: Theme.colors.primary.main,
  "animation": `${spin} 0.46s linear infinite`,
  "-webkit-animation": `${spin} 0.46s linear infinite`
});

export const labelStyle = Styles.style({
  textOverflow: 'ellipsis',
  overflow: 'hidden'
})

export const multiLineTextStyle = Styles.style({
  display: '-webkit-box',
  '-webkit-line-clamp': 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
})

export const customStyles = Styles.style({
  cursor: 'pointer',
  $nest: {
    '.has-border:after': {
      content: "''",
      position: 'absolute',
      width: 2,
      height: 'calc(100% - 2.5rem)',
      display: 'block',
      backgroundColor: Theme.divider,
      opacity: 0.5,
      transform: 'translateX(-50%)',
      left: '18px',
      top: '2.5rem'
    },
    '.hovered-icon': {
      transition: 'background 0.3s ease-in'
    },
    '.hovered-icon:hover': {
      borderRadius: '50%',
      background: Theme.colors.primary.light,
      $nest: {
        'svg': {
          fill: `${Theme.colors.primary.main} !important`
        }
      }
    },
    '.avatar img': {
      objectFit: 'cover'
    }
  }
})

export const analyticStyle = Styles.style({
  $nest: {
    'i-icon': {
      transition: 'background 0.3s ease-in'
    },
    'i-label': {
      transition: 'color 0.3s ease-in'
    },
    '.analytic:hover': {
      $nest: {
        'i-icon': {
          background: Theme.colors.primary.light,
          borderRadius: '50%'
        },
        'i-icon svg': {
          fill: `${Theme.colors.primary.main}!important`
        },
        'i-label': {
          color: `${Theme.colors.primary.main}!important`
        }
      }
    },
    '.green-icon:hover': {
      $nest: {
        'i-icon': {
          background: Theme.colors.success.light,
          borderRadius: '50%'
        },
        'i-icon svg': {
          fill: `${Theme.colors.success.main}!important`
        },
        'i-label': {
          color: `${Theme.colors.success.main}!important`
        }
      }
    },
    '.red-icon:hover': {
      $nest: {
        'i-icon': {
          background: Theme.colors.error.light,
          borderRadius: '50%'
        },
        'i-icon svg': {
          fill: `${Theme.colors.error.main}!important`
        },
        'i-label': {
          color: `${Theme.colors.error.main}!important`
        }
      }
    }
  }
})
