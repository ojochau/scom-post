import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const getIconStyleClass = (color: string) => {
  const styleObj: any = {
    $nest: {
      'i-label': {
        transition: 'color 0.3s ease-in'
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
      '-webkit-line-clamp': 10,
      // @ts-ignore
      '-webkit-box-orient': 'vertical'
    }
  }
})

export const maxHeightStyle = Styles.style({
  // maxHeight: 500,
  // overflow: 'hidden',
  $nest: {
    '#pnlDetail': {
      maxHeight: 500,
      overflow: 'hidden',
    },
    // '#pnlDetail:container(height > 500px)': {
    //   $nest: {
    //     '#showMoreWrapper': {
    //       display: 'block',
    //       background: 'black !important'
    //     }
    //   }
    // },
    // '#pnlDetail:container(height <= 500px)': {
    //   $nest: {
    //     '#showMoreWrapper': {
    //       display: 'block',
    //       background: 'white !important'
    //     }
    //   }
    // },
    '#btnShowMore': {
      
    }
  }
})
