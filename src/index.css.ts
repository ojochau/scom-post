import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const getIconStyleClass = (img: string, color: string) => {
  const styleObj: any = {
    $nest: {
      'i-panel': {
        transition: 'background 0.3s ease-in',
        backgroundSize: 'contain'
      },
      'i-label': {
        transition: 'color 0.3s ease-in'
      },
      '&:hover': {
        $nest: {
          'i-panel': {
            background: `url(${img})`,
            backgroundSize: 'contain'
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
