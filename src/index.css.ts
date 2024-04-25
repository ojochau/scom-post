import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const getIconStyleClass = (color: string) => {
  const styleObj: any = {
    $nest: {
      // 'i-label': {
      //   transition: 'color 0.3s ease-in'
      // },
      '&.highlighted': {
        $nest: {
          'i-icon svg': {
            fill: `${color}!important`
          },
          'i-label': {
            color: `${color}!important`
          }
        }
      },
      '&:hover': {
        $nest: {
          'i-icon svg': {
            fill: `${color}!important`
          },
          'i-label': {
            color: `${color}!important`
          }
        }
      }
    }
  };
  return Styles.style(styleObj)
}

export const hoverStyle = Styles.style({
 $nest: {
   '&:hover svg': {
      fill: `${Theme.text.primary} !important`
   }
 }
})

export const ellipsisStyle = Styles.style({
  $nest: {
    'i-markdown-editor': {
      display: '-webkit-box',
      '-webkit-line-clamp': 20,
      // @ts-ignore
      '-webkit-box-orient': 'vertical'
    }
  }
})

export const maxHeightStyle = Styles.style({
  $nest: {
    '#pnlDetail': {
      maxHeight: 400,
      overflow: 'hidden',
    },
  }
})

export const customLinkStyle = Styles.style({
  $nest: {
    'a': {
      color: `${Theme.colors.primary.main}!important`,
      display: `inline !important`,
    },
    'img': {
      maxWidth: '100%'
    }
  }
})

export const cardContentStyle = Styles.style({
  $nest: {
    'i-image': {
      transform: 'translateY(-100%)',
      $nest: {
        '&>img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }
      }
    },
    '@media only screen and (max-width: 767px)': {
      $nest: {
        '.entry-content': {
          "-webkit-line-clamp": `3 !important`
        }
      }
    }
  }
});