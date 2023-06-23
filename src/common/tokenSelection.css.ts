import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('.token-selection', {
  $nest: {
    '.token-agree-input': {
      $nest: {
        'i-checkbox:not(.disabled):hover input ~ .checkmark': {
          borderColor: '#FF8800',
        },
        'i-checkbox.is-checked .i-checkbox_label': {
          color: 'yellow'
        },
        '.i-checkbox_label': {
          fontSize: '1.5rem',
          color: 'yellow',
          width: '150px !important'
        },
        'i-checkbox .checkmark': {
          height: '30px',
          width: '30px',
          background: 'none',
          border: `3px solid #FF8800`,
        },
        'i-checkbox .checkmark:after': {
          border: `3px solid #FF8800`,
          height: '16px',
          left: '7.5px',
          top: '0px',
          width: '7px',
          borderLeft: 0,
          borderTop: 0,
        }
      }
    },
    '.token-import-input': {
      width: '100%',
      $nest: {
        'input': {
          width: '100%',
          background: 'none',
          color: 'blue',
          border: 'none',
          fontSize: '1rem',
          margin: '5px 0',
        }
      }
    },
    'i-icon': {
      display: 'inline-block'
    },
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
    '.ml-auto': {
      marginLeft: 'auto',
    },
    '.custom-btn': {
      display: 'flex',
      alignItems: 'center',
      width: 'max-content',
      padding: '0.25rem 0.5rem',
      boxShadow: 'none',
      background: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box',
      $nest: {
        '&:hover': {
          background: 'transparent linear-gradient(270deg, #FF9900 0%, #FC7428 100%) 0% 0% no-repeat padding-box',
          opacity: .9
        },
        '&.disabled': {
          background: 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box',
          opacity: 1
        },
        '> i-icon': {
          marginRight: '0',
          height: '18px !important',
        },
        '> i-image': {
          lineHeight: 'initial',
          marginRight: '0.5rem',
        },
        '&.has-token': {
          background: 'transparent',
          fontWeight: 'bold',
          color: '#f6c958',
          paddingRight: '0',
          $nest: {
            '> i-icon': {
              marginRight: '-7px',
              fill: '#F29224',
            }
          }
        },
      },
    },
    '#btnToken': {
      whiteSpace: 'nowrap',
      $nest: {
        'i-icon': {
          marginLeft: '0.25rem',
        }
      }
    },
    '.bg-modal': {
      $nest: {
        '.modal': {
          background: Theme.background.modal,
          width: 450,
          maxWidth: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          color: Theme.text.primary,
          marginTop: 40
        },
      }
    },
    '#tokenImportModal.bg-modal .modal': {
      width: 400,
    },
    '#tokenSelectionModal': {
      $nest: {
        '.search': {
          position: 'relative',
          marginBottom: '1.5rem',
          $nest: {
            'i-icon': {
              position: 'absolute',
              top: 'calc(50% - 8px)',
              left: '1rem',
              transform: 'rotate(90deg)',
              opacity: 0.7
            },
            'svg': {
              fill: `${Theme.input.fontColor} !important`
            },
            'i-input': {
              width: '100%'
            },
            'i-input > input': {
              width: '100%',
              height: 'auto !important',
              padding: '1rem 1.5rem 1rem 2.25rem',
              borderRadius: '0.5rem',
              border: '2px solid #9C9C9C',
              background: Theme.input.background,
              color: Theme.input.fontColor,
              fontSize: 'inherit',
            }
          }
        },
        '.token-header': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBlock: '0.5rem',
          $nest: {
            'i-label *': {
              fontSize: '1rem',
            },
            '.token-section': {
              position: 'relative',
              cursor: 'pointer',
            },
            'i-icon': {
              width: '10px',
              height: '14px',
              display: 'flex',
              fill: Theme.text.primary,
              position: 'absolute',
              right: '0',
            },
            '.icon-sort-up': {
              top: '2px',
            },
            '.icon-sort-down': {
              bottom: '2px',
            },
            '.icon-sorted': {
              fill: '#F29224',
            }
          }
        },
        '.common-token': {
          $nest: {
            'i-grid-layout': {
              margin: '0.5rem 0 0',
              alignItems: 'center',
              justifyContent: 'unset'
            },
            '.grid-item': {
              height: '50px',
              padding: '8px 20px',
              borderRadius: '1rem',
              border: '2px solid transparent',
              cursor: 'pointer',
              background: Theme.background.main,
              $nest: {
                '&:hover': {
                  borderColor: '#F29224'
                },
                'i-image': {
                  marginRight: '0.5rem'
                },
                'i-label': {
                  overflow: 'hidden'
                },
              }
            },
          }
        },
        '.token-list': {
          margin: '0.5rem -0.5rem',
          paddingInline: '0.5rem',
          maxHeight: '45vh',
          overflowY: 'auto',
          $nest: {
            '.token-info': {
              display: 'flex',
              flexDirection: 'column',
              fontSize: '1rem',
              marginRight: '0.5rem',
              textAlign: 'left'
            },
            '.token-item': {
              padding: '0.75rem 0.5rem',
              borderRadius: '1rem',
              overflow: 'unset',
              background: Theme.background.main,
              cursor: 'pointer',
              marginBottom: '0.75rem',
              minHeight: '50px',
              $nest: {
                '&:hover': {
                  opacity: 0.8
                },
                'i-image': {
                  marginRight: '0.5rem'
                },
                '&:not(:first-child)': {
                  marginTop: 0
                }
              }
            },
            '.token-name i-label > *': {
              fontSize: '0.75rem',
              marginRight: '0.5rem',
              color: 'rgba(255,255,255,0.55)'
            }
          }
        }
      }
    },
    '@media screen and (max-width: 768px)': {
      $nest: {
        '.grid-item': {
          padding: '8px !important',
        },
      },
    },
  }
})