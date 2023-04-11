import { Styles } from '@ijstech/components';

export default Styles.style({
  textAlign: 'center',
  $nest: {
    'i-label > *': {
      fontSize: '.875rem',
      wordBreak: 'normal'
    },
    '.modal': {
      minWidth: '25%',
      maxWidth: '100%',
      width: 455
    },
    '.i-modal_content': {
      padding: '0 2.563rem 3rem'
    },
    '.i-modal_header': {
      borderBottom: 'none !important'
    },
    'i-button': {
      padding: '1rem 2rem',
      textAlign: 'center'
    },
  }
})