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

export const getImageStyle = (aspectRatio: string) => {
  return Styles.style({
    display: 'block',
    aspectRatio: aspectRatio,
    $nest: {
      '> img': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        aspectRatio: aspectRatio
      }
    }
  })
} 

export const domainLinkStyle = Styles.style({
  $nest: {
    'i-link a': {
      color: Theme.text.secondary,
      textDecoration: 'none'
    },
    'i-link a:hover': {
      color: Theme.colors.primary.dark,
      textDecoration: 'underline'
    }
  }
})