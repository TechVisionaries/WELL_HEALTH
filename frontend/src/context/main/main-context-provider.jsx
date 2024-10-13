import PropTypes from "prop-types";
import { useMemo, useReducer, useCallback, useEffect } from "react";

import { MainContext } from "./main-context";
import axios, { endpoints } from "../../utils/axios";

const initialState = {
  loading: false,
  user: null,
  health_card_state: null,
  all_doctors: [],
  patient_health_card: null,
  all_patients: [],
  add_prescription: null,
  prescriptions: [],
  health_card_update_state: null,
};

const reducer = (state, action) => {
  if (action.type === "INITIAL") {
    return {
      loading: action.payload.loading,
      health_card_state: action.payload.health_card_state,
      all_doctors: action.payload.all_doctors,
      patient_health_card: action.payload.patient_health_card,
      all_patients: action.payload.all_patients,
      add_prescription: action.payload.add_prescription,
      prescriptions: action.payload.prescriptions,
      health_card_update_state: action.payload.health_card_update_state,
    };
  }
  if (action.type === "CREATE_HEALTH_CARD") {
    return {
      ...state,
      health_card_state: action.payload.health_card_state,
    };
  }
  if (action.type === "GET_ALL_DOCTOTS") {
    return {
      ...state,
      all_doctors: action.payload.all_doctors,
    };
  }
  if (action.type === "GET_HEALTH_CARD_BY_PATIENT_ID") {
    return {
      ...state,
      patient_health_card: action.payload.patient_health_card,
    };
  }
  if (action.type === "GET_ALL_PATIENTS") {
    return {
      ...state,
      all_patients: action.payload.all_patients,
    };
  }
  if (action.type === "ADD_PRESCRIPTION") {
    return {
      ...state,
      add_prescription: action.payload.add_prescription,
    };
  }
  if (action.type === "GET_ALL_PRESCRIPTIONS") {
    return {
      ...state,
      prescriptions: action.payload.prescriptions,
    };
  }
  if (action.type === "UPDATE_HEALTH_CARD") {
    return {
      ...state,
      health_card_update_state: action.payload.health_card_update_state,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export function MainContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    dispatch({
      type: "INITIAL",
      payload: {
        loading: false,
        user: null,
        health_card_state: null,
        patient_health_card: null,
        all_patients: null,
        add_prescription: null,
        prescriptions: null,
        health_card_update_state: null,
      },
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const create_health_card = useCallback(async (newHealthCard) => {
    const response = await axios.post(
      endpoints.health_card.create,
      newHealthCard
    );

    const { success, message, data } = response.data;

    dispatch({
      type: "CREATE_HEALTH_CARD",
      payload: {
        health_card_state: {
          success,
          message,
          data,
        },
      },
    });
  }, []);

  const get_all_doctors = useCallback(async () => {
    const response = await axios.get(endpoints.health_card.get_all_doctors);

    const { success, message, data } = response.data;

    dispatch({
      type: "GET_ALL_DOCTOTS",
      payload: {
        all_doctors: {
          data,
          success,
          message,
        },
      },
    });
  }, []);

  const get_health_card_by_patient_id = useCallback(async (userId) => {
    const response = await axios.get(
      `${endpoints.health_card.get_hralth_card_by_patient_id}/${userId}`
    );

    const { success, message, data } = response.data;

    dispatch({
      type: "GET_HEALTH_CARD_BY_PATIENT_ID",
      payload: {
        patient_health_card: {
          data,
          success,
          message,
        },
      },
    });

    dispatch({ type: "LOADING_END" });
  }, []);

  const get_all_patients = useCallback(async () => {
    const response = await axios.get(endpoints.health_card.get_all_patients);

    const { success, message, data } = response.data;

    dispatch({
      type: "GET_ALL_PATIENTS",
      payload: {
        all_patients: {
          data,
          success,
          message,
        },
      },
    });
  }, []);

  const add_new_prescription = useCallback(async (newPrescription) => {
    const response = await axios.post(
      endpoints.health_card.addPrescription,
      newPrescription
    );

    const { success, message, data } = response.data;

    dispatch({
      type: "ADD_PRESCRIPTION",
      payload: {
        add_prescription: {
          success,
          message,
          data,
        },
      },
    });
  }, []);

  const get_all_prescriptions = useCallback(async (userId) => {
    const response = await axios.get(
      `${endpoints.health_card.get_all_prescriptions}/${userId}`
    );

    const { success, message, data } = response.data;

    dispatch({
      type: "GET_ALL_PRESCRIPTIONS",
      payload: {
        prescriptions: {
          data,
          success,
          message,
        },
      },
    });
  }, []);

  const update_health_card = useCallback(
    async (healthCardData, userId, health_card_id) => {
      const response = await axios.post(
        `${endpoints.health_card.update_health_card}/${userId}/${health_card_id}`,
        healthCardData
      );

      const { success, message, data } = response.data;

      dispatch({
        type: "UPDATE_HEALTH_CARD",
        payload: {
          health_card_update_state: {
            success,
            message,
            data,
          },
        },
      });
    },
    []
  );

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      loading: state.loading,
      user: state.loading,
      health_card_state: state.health_card_state,
      all_doctors: state.all_doctors,
      patient_health_card: state.patient_health_card,
      all_patients: state.all_patients,
      add_prescription: state.add_prescription,
      prescriptions: state.prescriptions,
      health_card_update_state: state.health_card_update_state,

      create_health_card,
      get_all_doctors,
      get_health_card_by_patient_id,
      get_all_patients,
      add_new_prescription,
      get_all_prescriptions,
      update_health_card,
    }),
    [
      create_health_card,
      get_all_doctors,
      get_health_card_by_patient_id,
      get_all_patients,
      add_new_prescription,
      get_all_prescriptions,
      update_health_card,
      state,
    ]
  );

  return (
    <MainContext.Provider value={memoizedValue}>
      {children}
    </MainContext.Provider>
  );
}

MainContextProvider.propTypes = {
  children: PropTypes.node,
};
