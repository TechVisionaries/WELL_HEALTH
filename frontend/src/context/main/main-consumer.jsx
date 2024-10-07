import PropTypes from 'prop-types';


import { MainContext } from './main-context';
import Loading from '../../components/Loading';

// ----------------------------------------------------------------------

export function MainConsumer({ children }) {
  return (
    <MainContext.Consumer>
      {(main) => (main.loading ? <Loading /> : children)}
    </MainContext.Consumer>
  );
}

MainConsumer.propTypes = {
  children: PropTypes.node,
};
