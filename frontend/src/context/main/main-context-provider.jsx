import PropTypes from 'prop-types';
import {useMemo, useReducer, useCallback, useEffect} from 'react';


import {MainContext} from './main-context';
import axios, { endpoints } from '../../utils/axios';

const initialState = {
  loading: false,
  user:null,
  health_card_state:null,
  
};

const reducer = (state, action) => {

  if (action.type === 'INITIAL') {
    return {
      loading: action.payload.loading, 
      health_card_state: action.payload.health_card_state
      
    };
  }
  if (action.type === 'CREATE_HEALTH_CARD') {
    return {
      ...state,
      health_card_state: action.payload.health_card_state, 
      
    };
  }  
  return state;

};

// ----------------------------------------------------------------------

export function MainContextProvider({children}) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {

    dispatch({
      type: 'INITIAL',
      payload: {
        loading:false,
        user:null,
        health_card_state:null
      },
    },[]);

  },[]);

  useEffect(() => {
    initialize();
  }, [initialize]);


  const create_health_card = useCallback(async (newHealthCard) => {

    const response = await axios.post(endpoints.health_card.create, newHealthCard);

    const { success, message,data } = response.data;
    
    dispatch({
      type: 'CREATE_HEALTH_CARD',
      payload: {
        health_card_state: {
          success,
          message,
          data
        },
      },
    });
  }, []);
  
  // const getQuatationByUserId = useCallback(async () => {

  //   const response = await axios.get(endpoints.quatation.get_by_user_id);

  //   const { success, message,data } = response.data;
    
  //   dispatch({
  //     type: 'GET_QUATATION_BY_USER',
  //     payload: {
  //       quatations: {
  //         data,
  //         success,
  //         message
  //       },
  //     },
  //   });
  // }, []);

  // const getQuatationByAdminId = useCallback(async () => {

  //   dispatch({ type: 'LOADING_START' });

  //   const response = await axios.get(endpoints.quatation.get_by_admin_id);

  //   const { success, message,data } = response.data;
    
  //   dispatch({
  //     type: 'GET_QUATATION_BY_ADMIN',
  //     payload: {
  //       quatations: {
  //         data,
  //         success,
  //         message
  //       },
  //     },
  //   });

  //   dispatch({ type: 'LOADING_END' }); 

  // }, []);




  // ----------------------------------------------------------------------


  const memoizedValue = useMemo(
    () => ({
      loading: state.loading,
      user: state.loading,
      health_card_state: state.health_card_state,

      create_health_card
      
    
    }), [
      create_health_card, 
        state
      ]);

  return <MainContext.Provider value={memoizedValue}>{children}</MainContext.Provider>;
}

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
