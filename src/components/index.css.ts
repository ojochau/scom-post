import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const tooltipStyle = Styles.style({
  $nest: {
    '.caret': {
      border: '10px solid transparent',
      borderTop: `10px solid ${Theme.background.modal}`
    }
  }
})

export const imageStyle = Styles.style({
  display: 'block',
  aspectRatio: '1 / 1',
  $nest: {
    '> img': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      aspectRatio: '1 / 1'
    }
  }
})