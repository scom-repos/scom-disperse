import { Styles } from '@ijstech/components';

export const walletModalStyle = Styles.style({
  backgroundColor: '#000',
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
    '.nav': {
      padding: '.2rem 1rem',
      fontWeight: '600',
      letterSpacing: '.015em',
      lineHeight: '19px',
      minHeight: 80,
      display: 'block',
      alignItems: 'center',
      borderBottom: `2px solid #F29224`,
      position: 'relative'
    },
    '.os-menu': {
      display: 'block',
      $nest: {
        '.heading': {
          textTransform: 'capitalize',
          fontSize: '1rem',
          lineHeight: '1rem',
          fontWeight: 400,
          whiteSpace: 'nowrap',
          color: 'hsla(0, 0%, 100%, 0.55)',
          maxHeight: 80,
          width: '100%',
          padding: '.75rem 1rem'
        },
        '> nav > div > i-menu-item > .desktop .title .heading': {
          borderRadius: '5px',
          padding: '.625rem 1.5rem'
        },
        '.show-dropdown > .link > .title .heading': {
          background: '#222237',
          color: '#fff',
        },
        'i-menu-item.menu-active > .desktop .title > .heading': {
          background: '#222237',
          color: '#fff'
        },
        'i-menu-item .title:hover > .heading': {
          background: '#222237',
          color: '#fff'
        },
        'i-menu-item > .desktop.dropdown > .link': {
          textOverflow: 'ellipsis',
          borderBottom: 'none',
          display: 'block',
          width: '100%',
          padding: '0'
        },
        'i-menu-item > .desktop > button.link': {
          width: '100%'
        },
        'i-menu-item > .desktop.dropdown > .link .title': {
          paddingLeft: 0,
          height: '100%'
        },
        'i-menu-item > i-menu > .dropdown': {
          background: '#252a48',
          boxShadow: '0 4px 8px 0 rgb(0 0 0 / 20%)'
        },
        'i-menu-item': {
          transformOrigin: '0 0',
          width: '100%'
        },
        'i-menu-item .title .heading': {
          transition: 'color .3s cubic-bezier(.645,.045,.355,1),border-color .3s cubic-bezier(.645,.045,.355,1),background .3s cubic-bezier(.645,.045,.355,1),padding .15s cubic-bezier(.645,.045,.355,1)'
        },
        'i-menu > .desktop.dropdown': {
          width: 'auto',
          minWidth: 160,
          paddingTop: '.25rem',
          paddingBottom: '.25rem',
          transition: 'border-color .3s cubic-bezier(.645,.045,.355,1),background .3s cubic-bezier(.645,.045,.355,1),padding .15s cubic-bezier(.645,.045,.355,1)'
        },
        '> nav > div > i-menu-item i-menu i-menu-item i-menu': {
          position: 'absolute',
          left: '100%',
          top: 0,
          paddingLeft: '5px',
          $nest: {
            '.desktop.dropdown': {
              position: 'relative'
            }
          }
        }
      }
    },
    '.os-mobile': {
      backgroundColor: '#252a48',
      position: 'absolute',
      left: -999,
      top: '62px',
      transition: 'all .3s ease-out',
      minWidth: '290px',
      zIndex: '9999',
      $nest: {
        '&.show-menu': {
          left: 0,
          transition: 'all .5s ease-in'
        },
        'i-menu-item': {
          color: '#F29224',
          whiteSpace: 'nowrap',
          width: '100%',
          $nest: {
            '> .desktop': {
              padding: '.75rem 1rem',
              borderLeft: `2px solid transparent`,
            },
          }
        },
        'i-menu-item.menu-active > .desktop': {
          borderLeft: `2px solid #F29224`,
          background: '#464b65'
        },
        'i-menu-item:hover > .desktop': {
          background: '#303552'
        },
        '.heading, .heading i-label *': {
          fontWeight: 'normal',
          fontSize: '1rem',
          color: '#F29224'
        },
        '> nav > div > i-menu-item .title .heading': {
          width: '100%',
          $nest: {
            '*': {
              fontWeight: 400,
              fontSize: 20
            },
            'i-slot': {
              width: '100%'
            }
          }
        },
        '> nav > div > i-menu-item.menu-active .title .heading *': {
          fontWeight: 700,
        }
      }
    },
    '.btn-hamburger': {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      $nest: {
        '&:not(.disabled):hover': {
          backgroundColor: 'transparent',
          background: 'transparent',
          boxShadow: 'none'
        }
      }
    },
    'i-menu.i-menu--horizontal > .desktop > .align': {
      alignItems: 'stretch !important',
      gridGap: '5px !important'
    },
    '.dir-icon': {
      transition: 'transform .24s'
    },
    '.btn': {
      height: 'auto !important',
      cursor: 'pointer',
      fontWeight: 600,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      backgroundColor: 'transparent',
      $nest: {
        '&:hover': {
          transition: 'all .2s ease-out'
        }
      }
    },
    '.btn-network': {
      padding: '6px 12px',
      backgroundColor: '#222237',
      border: '2px solid #FFB82F',
      color: '#fff',
      borderRadius: 6,
      fontWeight: 400,
      $nest: {
        '&:hover': {
          backgroundColor: '#222237',
        }
      }
    },
    '.btn-connect': {
      padding: '.375rem .5rem',
      border: 'none',
      transition: 'all .2s ease-out',
      $nest: {
        '&:hover': {
          opacity: '.9',
          transition: 'all .2s ease-out',
        }
      }
    },
    '.my-wallet': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#222237',
      borderRadius: 6,
      height: 36,
      textAlign: 'center',
      padding: '6px 10px',
      position: 'relative'
    },
    '.address-info': {
      display: 'flex',
      gap: '.5rem',
      lineHeight: '30px',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: '.25rem'
    },
    '.os-modal': {
      borderRadius: 20,
      boxSizing: 'border-box',
      fontSize: '.875rem',
      fontWeight: 400,
      $nest: {
        'i-icon': {
          display: 'inline-block'
        },
        '.mr-2-5': {
          marginRight: '2.5rem'
        },
        '&.connect-modal > div > div': {
          width: 440,
          maxWidth: '100%',
          height: 'auto'
        },
        '&.connect-modal .i-modal_content': {
          padding: '0 1.5rem'
        },
        '&.account-modal .i-modal_content': {
          padding: '1rem 1.5rem'
        },
        '&.account-modal > div > div': {
          height: 'auto',
          minHeight: 200,
          width: 440,
          maxWidth: '100%',
        },
        '> div > div': {
          backgroundColor: '#000',
          height: 'calc(100% - 160px)',
          borderRadius: 15,
          lineHeight: 1.5,
          wordWrap: 'break-word',
          padding: 0,
          minHeight: 400,
          width: 360
        },
        '.i-modal_content': {
          padding: '0 1.25rem'
        },
        '.i-modal_header': {
          borderRadius: '20px 20px 0 0',
          background: 'unset',
          padding: '16px 24px 0',
        },
        '.networkSection': {
          marginLeft: '-1.25rem',
          marginRight: '-1.25rem',
        },
        '.list-view': {
          $nest: {
            '.list-item:hover': {
              backgroundColor: '#51515c',
              $nest: {
                '> *': {
                  opacity: 1
                }
              }
            },
            '.list-item:not(:first-child)': {
              marginTop: '.5rem'
            },
            '.list-item': {
              backgroundColor: '#34343A',
              minHeight: '50px',
              position: 'relative',
              borderRadius: 10,
              cursor: 'pointer',
              border: 'none',
              transition: 'all .3s ease-in',
              overflow: 'unset',
              $nest: {
                '&.disabled-network-selection': {
                  cursor: 'default',
                  $nest: {
                    '&:hover > *': {
                      backgroundColor: '#34343A',
                      opacity: '0.5 !important',
                    }
                  }
                },
                '> *': {
                  opacity: 0.8
                }
              }
            },
            '.list-item.is-actived': {
              backgroundColor: '#51515c',
              $nest: {
                '> *': {
                  opacity: 1
                },
                '&:after': {
                  content: "''",
                  top: '50%',
                  left: 9,
                  position: 'absolute',
                  background: '#20bf55',
                  borderRadius: '50%',
                  width: 10,
                  height: 10,
                  transform: 'translate3d(-50%,-50%,0)'
                },
                '.custom-img': {
                  marginLeft: '.75rem'
                }
              }
            }
          }
        },
        '.networks': {
          display: 'flex',
          flexDirection: 'column',
          color: '#f05e61',
          marginTop: '1.5rem',
          height: 'calc(100% - 160px)',
          overflowY: 'auto',
          width: '100% !important',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          $nest: {
            '.list-item': {
              padding: '.5rem'
            }
          }
        },
        '.wallets': {
          marginTop: '.5rem',
          $nest: {
            '.list-item': {
              padding: '.5rem',
              position: 'relative',
            },
            '.list-item .image-container': {
              order: 2
            }
          }
        },
        '.small-label > *': {
          fontSize: '.875rem'
        },
        '.large-label > *': {
          fontSize: '1.25rem',
          lineHeight: 1.5
        },
        '.custom-link *': {
          color: '#fff'
        },
        '.custom-link a': {
          display: 'inline-flex',
          alignItems: 'center'
        }
      }
    },
    '@media screen and (max-width: 768px)': {
      $nest: {
        '#walletContainer': {
          marginLeft: 'auto',
        },
        '#networkBalanceContainer': {
          $nest: {
            'i-label': {
              display: 'none',
            },
            'i-image': {
              width: '2rem !important',
              height: '2rem',
            },
            '.btn-network': {
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              marginRight: '0.5rem !important'
            },
            '.my-wallet': {
              display: 'none',
            },
          },
        },
      },
    }
  }
})
