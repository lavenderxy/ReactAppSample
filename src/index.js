import { render } from 'react-dom';
import UniversalRouter from 'universal-router';
import { createBrowserHistory } from 'history';
import routes from './app/routes';

const router = new UniversalRouter(routes);

function locationResolver(uri) {
  router.resolve(uri.pathname).then(
    component => {
      render(component, document.querySelector('#app'));
    },
    err => {
      if (err.code == 404) {
        const layout = <h1>Not Found</h1>;
        render(layout, document.querySelector('#app'));
      } else {
        throw new Error(err);
      }
    }
  );
}

locationResolver(createBrowserHistory().location);