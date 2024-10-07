import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { LoadingScreen } from 'src/components/loading-screen';

import { useMainContext } from '../hooks';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function LoadingContextProvider({ children }) {

  const { loading } = useMainContext();


  return<>{loading ? <LoadingScreen /> : <>{children}</>}</>
}

LoadingContextProvider.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

// function Container({ children }) {
//   const router = useRouter();

//   const { authenticated, method } = useMainContext();

//   const [checked, setChecked] = useState(false);

//   const check = useCallback(() => {
//     if (!authenticated) {
//       const searchParams = new URLSearchParams({
//         returnTo: window.location.pathname,
//       }).toString();

//       const loginPath = loginPaths[method];

//       const href = `${loginPath}?${searchParams}`;

//       router.replace(href);
//     } else {
//       setChecked(true);
//     }
//   }, [authenticated, method, router]);

//   useEffect(() => {
//     check();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (!checked) {
//     return null;
//   }

//   return <>{children}</>;
// }

// Container.propTypes = {
//   children: PropTypes.node,
// };
