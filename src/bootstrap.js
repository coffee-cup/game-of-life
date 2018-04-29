import 'babel-polyfill';
import 'tachyons/css/tachyons.css';
import 'normalize-css';
import './scss/main.scss';

const index = import('./index');
index.then(() => {
  console.log('Loaded...');
});
