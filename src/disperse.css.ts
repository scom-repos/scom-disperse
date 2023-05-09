import { Styles } from '@ijstech/components';

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
          fill: '#F29224'
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
          background: '#34343A',
          color: '#fff',
          padding: '0.5rem 0.75rem',
          borderRadius: '10px',
          border: 'none',
          height: '170px !important',
          resize: 'none',
          outline: 'none',
          $nest: {
            '&::placeholder': {
              color: '#fff',
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
          background: '#000',
          width: 420,
          maxWidth: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          color: '#fff'
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
