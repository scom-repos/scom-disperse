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
            'span': {
              fontWeight: 700,
              fontSize: '1rem',
              color: Theme.colors.primary.main
            }
          },
        },
      },
    },
    '.hidden': {
      display: 'none !important'
    }
  }
});

export const disperseStyle = Styles.style({
  $nest: {
    'i-hstack.disabled': {
      opacity: '0.5',
    },
    '.link-icon > svg': {
      width: '20px',
    },
    '.text-overflow': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '#tokenElm': {
      cursor: 'pointer',
      borderColor: '#9C9C9C',
      padding: '15px 10px !important',
      $nest: {
        '&.disabled': {
          cursor: 'default',
          borderColor: '#F29224'
        },
        'i-icon svg': {
          fill: Theme.text.primary
        }
      }
    },
    '.csv-button': {
      background: '#34343A',
      height: 45,
      width: 170,
      cursor: 'pointer',
      $nest: {
        '*': {
          fontSize: 18,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
        },
        '&:hover': {
          background: '#505050 !important',
        },
        '&.disabled': {
          cursor: 'default',
          background: 'linear-gradient(270deg, #7B7B7B 0%, #929292 100%)',
          opacity: 0.9,
        },
      },
    },
    '.input-batch': {
      $nest: {
        'textarea': {
          background: Theme.input.background,
          color: Theme.input.fontColor,
          padding: '0.5rem 0.75rem',
          borderRadius: '10px',
          border: 'none',
          height: '170px !important',
          resize: 'none',
          outline: 'none',
          $nest: {
            '&::placeholder': {
              color: Theme.input.fontColor,
              opacity: 0.8
            },
            '&:focus::placeholder': {
              opacity: 0
            },
          },
        },
      },
    },
    '.overflow-auto': {
      overflow: 'auto',
    },
    '.custom-scroll': {
      $nest: {
        '::-webkit-scrollbar-track': {
          background: '#FFB82F',
        },
        '::-webkit-scrollbar': {
          width: '5px',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#FF8800',
          borderRadius: '5px',
        },
      },
    },
    '.bg-modal': {
      $nest: {
        '.modal': {
          background: Theme.background.modal,
          width: 420,
          maxWidth: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          color: Theme.text.primary
        },
      }
    },
    '.ml-auto': {
      marginLeft: 'auto',
    },
    '.step-elm': {
      flexWrap: 'wrap',
      gap: '10px',
      padding: '15px 10px !important',
      $nest: {
        '&#thirdStepElm': {
          paddingInline: '0 !important'
        }
      }
    },
    '#containerUserInfo > i-vstack': {
      gap: '8px !important'
    },
    '#secondStepElm > i-hstack': {
      flexWrap: 'wrap',
    },
    '#thirdStepElm > i-vstack': {
      maxWidth: '100%',
      width: '100% !important',
      flexWrap: 'wrap',
      $nest: {
        '&> i-hstack': {
          flexWrap: 'wrap',
          width: '100%',
        },
        '.custom-scroll': {
          overflow: 'auto',
          $nest: {
            '&::-webkit-scrollbar-track': {
              background: '#FFB82F',
            },
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#FF8800',
              borderRadius: '3px',
            }
          }
        },
        '.address-elm': {
          minWidth: '650px',
        },
        '.step-3': {
          height: 'auto !important',
          width: '100% !important',
          padding: '20px !important',
        }
      }
    }
  },
});

export const tokenModalStyle = Styles.style({
  $nest: {
    '.i-modal_header': {
      display: 'none'
    },
    '#gridTokenList': {
      maxHeight: '50vh',
      overflow: 'auto',
      $nest: {
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar': {
          width: '5px',
          height: '5px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#FF8800',
          borderRadius: '5px'
        }
      }
    },
    '#pnlSortBalance': {
      $nest: {
        '.icon-sort-up': {
          top: 1
        },
        '.icon-sort-down': {
          bottom: 1
        },
        'i-icon svg': {
          fill: 'inherit'
        }
      }
    }
  }
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
