import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiFormLabel-root': {
      color: 'white'
    }
  },
  btn: {
    color: 'white',
    borderColor: 'white',
    height: 50,
    padding: '0 30px',
    margin: '10px'
  },
  tf: {
    margin: '10px',
    color: 'white',
    variant: 'outlined',
    height: 50,
  },
  select: {
    margin: '10px',
    color: 'white',
    variant: 'outlined',
    height: 50,
    minWidth: 500,
  },
  bar: {
    fontSize: '20px',
    backgroundColor: 'black',
    height: '70px',
  },
  link: {
    color: 'white',
  }
});

export default useStyles;
