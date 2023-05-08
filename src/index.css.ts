import { Styles } from '@ijstech/components';
import Assets from './assets';

// Styles.Theme.darkTheme.background.default = '#212128';
// Styles.Theme.darkTheme.background.gradient = 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box';
// Styles.Theme.darkTheme.background.modal = '#000';
// Styles.Theme.darkTheme.background.main = '#222237',
// Styles.Theme.darkTheme.colors.primary.dark = '#F05E61';
// Styles.Theme.darkTheme.colors.primary.main = '#F29224';
// Styles.Theme.darkTheme.colors.secondary.dark = '#f7d063';
// Styles.Theme.darkTheme.colors.secondary.main = '#FF8800';
// Styles.Theme.darkTheme.text.secondary = 'hsla(0, 0%, 100%, 0.55)';
// Styles.Theme.darkTheme.typography.fontFamily = 'Proxima Nova';
// Styles.Theme.darkTheme.colors.warning.dark = '#f57c00';
// Styles.Theme.darkTheme.colors.warning.light = '#F6C958';
// Styles.Theme.darkTheme.colors.warning.main = '#ffa726';
// Styles.Theme.darkTheme.divider = '#0E132E';
// Styles.Theme.darkTheme.typography.fontSize = '16px';

const colorVar = {
  primaryButton: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box',
  primaryGradient: 'linear-gradient(270deg, #FF9900 0%, #FC7428 100%)',
  darkBg: '#181E3E 0% 0% no-repeat padding-box',
  primaryDisabled: 'transparent linear-gradient(270deg, #7B7B7B 0%, #929292 100%) 0% 0% no-repeat padding-box'
}

export const disperseLayout = Styles.style({
  background: '#212128',
  marginInline: 'auto',
  $nest: {
    'i-label': {
      color: '#fff'
    },
    'i-button': {
      color: '#fff',
      $nest: {
        'i-icon.is-spin': {
          fill: '#fff !important'
        }
      }
    },
    '.overflow-inherit': {
      overflow: 'inherit',
    },
    '::selection': {
      color: '#fff',
      background: '#1890ff'
    },
    '.template-layout': {
      maxWidth: '1420px',
      marginInline: 'auto',
    },
    '.container-layout': {
      width: '100%',
      padding: '20px 10px',
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
    '.dark-bg, .dark-modal > div > div': {
      background: colorVar.darkBg,
      borderRadius: 5
    },
    '.network-msg': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '15rem',
      $nest: {
        'span': {
          fontSize: '1.25rem',
          color: '#F29224',
        },
      },
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
          background: '#000',
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
              background: '#F29224',
              fill: '#fff !important',
            },
            'span': {
              fontWeight: 700,
              fontSize: '1rem',
              color: '#FF8800'
            },
          },
        },
      },
    },
    '.account-dropdown': {
      $nest: {
        '.modal': {
          background: '#222237',
          border: `2px solid #0E132E`,
          padding: '10px',
          minWidth: 200,
          marginTop: 10
        },
        'i-button': {
          background: colorVar.primaryButton,
          cursor: 'pointer',
          padding: '.5rem .75rem'
        },
        '.icon': {
          backgroundColor: 'transparent',
          height: 'auto',
          width: 'auto',
          padding: '.5rem .75rem .5rem 0',
        },
        'i-icon': {
          height: 14,
          width: 14
        }
      }
    },
    '.hidden': {
      display: 'none !important'
    },
    '.actions-dropdown': {
      cursor: 'pointer',
      position: 'relative',
      $nest: {
        '> i-button': {
          height: 'auto',
          minWidth: 'auto',
          padding: '.5rem .75rem',
          border: 'none',
          background: colorVar.primaryButton,
          lineHeight: '1.25rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          $nest: {
            '&.disabled': {
              background: colorVar.primaryDisabled,
              opacity: 0.9,
              cursor: 'default',
            },
          },
        },
        '.modal': {
          background: '#000',
          border: `2px solid #0E132E`,
          padding: '10px',
          marginTop: 0,
          minWidth: 0,
          $nest: {
            'i-button': {
              background: colorVar.primaryButton,
              marginBottom: '0.5rem',
              paddingBlock: '0.675rem',
              border: 'none',
              transition: 'all .2s ease-out',
              borderRadius: 5,
              padding: '0.25rem 1.5rem',
              opacity: 1,
              whiteSpace: 'nowrap',
              $nest: {
                '&.disabled': {
                  background: colorVar.primaryDisabled,
                },
                '&:last-child': {
                  marginBottom: 0
                },
              },
            }
          }
        },
        '.icon': {
          backgroundColor: 'transparent',
          height: 'auto',
          width: 'auto',
          padding: '.5rem .75rem .5rem 0',
        },
        'i-icon': {
          height: '16px !important',
          width: '16px !important',
          display: 'flex',
        },
        '.loading-icon': {
          marginLeft: '0.15rem',
        }
      }
    },
    '@media screen and (max-width: 768px)': {
      $nest: {
        '.actions-dropdown .button': {
          padding: '0.15rem',
        },
      },
    },
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
