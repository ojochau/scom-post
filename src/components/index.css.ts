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
