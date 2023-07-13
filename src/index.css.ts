import { Styles } from '@ijstech/components';
import Assets from './assets';
const Theme = Styles.Theme.ThemeVars;

const colorVar = {
  primaryButton: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box',
  primaryGradient: 'linear-gradient(270deg, #FF9900 0%, #FC7428 100%)',
  darkBg: '#181E3E 0% 0% no-repeat padding-box',
  primaryDisabled: 'transparent linear-gradient(270deg, #7B7B7B 0%, #929292 100%) 0% 0% no-repeat padding-box'
}

export const disperseLayout = Styles.style({
  background: Theme.background.main,
  marginInline: 'auto',
  $nest: {
    'i-button': {
      color: '#fff',
      $nest: {
        'i-icon.is-spin': {
          fill: '#fff !important'
        },
        'svg': {
          fill: '#fff !important'
        }
      }
    },
    '.overflow-inherit': {
      overflow: 'inherit',
    },
    '.template-layout': {
      maxWidth: '1200px',
      marginInline: 'auto',
    },
    '.container-layout': {
      width: '100%',
      padding: '0 10px',
    },
    '.btn-os': {
      background: colorVar.primaryButton,
      height: 'auto !important',
      color: '#fff',
      transition: 'background .3s ease',
      fontSize: '1rem',
      $nest: {
        'i-icon.loading-icon': {
          marginInline: '0.25rem',
          width: '16px !important',
          height: '16px !important',
        },
      },
    },
    '.btn-os:not(.disabled):not(.is-spinning):hover, .btn-os:not(.disabled):not(.is-spinning):focus': {
      background: colorVar.primaryGradient,
      backgroundColor: 'transparent',
      boxShadow: 'none',
      opacity: 0.9
    },
    '.btn-os:not(.disabled):not(.is-spinning):focus': {
      boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
    },
    '.btn-os.disabled, .btn-os.is-spinning': {
      background: colorVar.primaryDisabled,
      opacity: 0.9,
      $nest: {
        '&:hover': {
          background: `${colorVar.primaryDisabled} !important`,
        }
      }
    },
    '.break-word': {
      wordBreak: 'break-word',
    },
    '.text-right': {
      textAlign: 'right',
    },
    'i-modal': {
      $nest: {
        '.modal': {
          background: Theme.background.modal
        },
        '.i-modal_header': {
          marginBottom: '1rem',
          paddingBlock: '0.5rem',
          fontSize: '1.25rem',
          fontWeight: 700,
          $nest: {
            'i-icon': {
              padding: '3.5px',
              width: '18px !important',
              height: '18px !important',
              background: Theme.colors.primary.main,
              fill: `${Theme.text.primary} !important`,
              $nest: {
                svg: {
                  fill: `${Theme.text.primary} !important`,
                }
              }
            },
            'span': {
              fontWeight: 700,
              fontSize: '1rem',
              color: Theme.colors.primary.main
            },
          },
        },
      },
    },
    '.hidden': {
      display: 'none !important'
    }
  }
});

Styles.fontFace({
  fontFamily: "Proxima Nova",
  src: `url("${Assets.fullPath('fonts/proxima_nova/ProximaNovaBold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Proxima Nova",
  src: `url("${Assets.fullPath('fonts/proxima_nova/ProximaNovaBoldIt.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'italic'
})

Styles.fontFace({
  fontFamily: "Proxima Nova",
  src: `url("${Assets.fullPath('fonts/proxima_nova/ProximaNovaLight.ttf')}") format("truetype")`,
  fontWeight: '300',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Proxima Nova",
  src: `url("${Assets.fullPath('fonts/proxima_nova/ProximaNovaLightIt.ttf')}") format("truetype")`,
  fontWeight: '300',
  fontStyle: 'italic'
})

Styles.fontFace({
  fontFamily: "Proxima Nova",
  src: `url("${Assets.fullPath('fonts/proxima_nova/ProximaNovaReg.ttf')}") format("truetype")`,
  fontWeight: 'normal',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Proxima Nova",
  src: `url("${Assets.fullPath('fonts/proxima_nova/ProximaNovaRegIt.ttf')}") format("truetype")`,
  fontWeight: 'normal',
  fontStyle: 'italic'
})

Styles.fontFace({
  fontFamily: "Proxima Nova",
  src: `url("${Assets.fullPath('fonts/proxima_nova/ProximaNovaBold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Apple SD Gothic Neo",
  src: `url("${Assets.fullPath('fonts/FontsFree-Net-Apple-SD-Gothic-Neo-Bold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Regular.ttf')}") format("truetype")`,
  fontWeight: 'nomal',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Bold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Light",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Light.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Medium",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Medium.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat SemiBold",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-SemiBold.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})
