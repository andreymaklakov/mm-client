import localStorageService, {
  getAccessToken,
  setTokens
} from "../service/localStorage.service";
import { createSlice, createAction } from "@reduxjs/toolkit";
import authService from "../service/auth.service";
import userService from "../service/user.service";
import generateAuthError from "../utils/generateAuthError";
import history from "../utils/history";

const initialState = getAccessToken()
  ? {
      entities: null,
      isLoading: true,
      signInError: "",
      logInError: "",
      changeError: "",
      isLoggedIn: true
    }
  : {
      entities: null,
      isLoading: false,
      signInError: "",
      logInError: "",
      changeError: "",
      isLoggedIn: false
    };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authRequested(state) {
      state.signInError = "";
      state.logInError = "";
    },
    authRequestSuccessed(state) {
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    authRequestFailed(state, action) {
      state.signInError = action.payload;
    },
    logInRequestFailed(state, action) {
      state.logInError = action.payload;
    },
    userCreated(state, action) {
      state.entities = action.payload;
    },
    getUserSuccessed(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    changeRequested(state) {
      state.changeError = "";
      state.isLoading = true;
    },
    changeRequestedSuccessed(state, action) {
      state.entities = action.payload;
      state.changeError = "";
      state.isLoading = false;
    },
    changeRequestedFailed(state, action) {
      state.changeError = action.payload;
      state.isLoading = false;
    },
    userLoggedOut(state) {
      state.entities = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      state.signInError = "";
      state.logInError = "";
      state.changeError = "";
    }
  }
});

const { reducer: userReducer, actions } = userSlice;
const {
  authRequested,
  authRequestSuccessed,
  authRequestFailed,
  getUserSuccessed,
  changeRequested,
  changeRequestedSuccessed,
  changeRequestedFailed,
  userLoggedOut,
  logInRequestFailed
} = actions;

const getUserRequested = createAction("user/getUserRequested");
const getUserFailed = createAction("user/getUserFailed");

export const getSignedUser = () => (state) => state.user.entities;

export const getUser = () => async (dispatch) => {
  dispatch(getUserRequested());

  try {
    let { content } = await userService.getSignedUser();

    Array.isArray(content) ? (content = content[0]) : content;

    delete content.password;

    dispatch(getUserSuccessed(content));
  } catch (error) {
    dispatch(getUserFailed(error.message));
  }
};

export const signUp = (payload) => async (dispatch) => {
  dispatch(authRequested());

  try {
    const data = await authService.register(payload);

    setTokens(data);

    dispatch(getUser());

    dispatch(authRequestSuccessed());
  } catch (error) {
    const { message, code } = error.response.data.error;

    if (code === 400) {
      const errorMessage = generateAuthError(message);
      dispatch(authRequestFailed(errorMessage));
    } else {
      dispatch(authRequestFailed(error.message));
    }
  }
};

export const logIn =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(authRequested());

    try {
      const data = await authService.login({ email, password });

      setTokens(data);
      dispatch(getUser());
      dispatch(authRequestSuccessed());
    } catch (error) {
      const { message, code } = error.response.data.error;

      if (code === 400) {
        const errorMessage = generateAuthError(message);
        dispatch(logInRequestFailed(errorMessage));
      } else {
        dispatch(logInRequestFailed(error.message));
      }
    }
  };

export const changeUserParams = (data) => async (dispatch) => {
  dispatch(changeRequested());

  try {
    let { content } = await userService.changeUserParams(data);

    Array.isArray(content) ? (content = content[0]) : content;

    dispatch(changeRequestedSuccessed(content));

    history.push("/main");
  } catch (error) {
    dispatch(changeRequestedFailed(error.message));
  }
};

export const logOut = () => (dispatch) => {
  localStorageService.removeAuthData();

  dispatch(userLoggedOut());

  history.replace("/");
};

export const changeUserPasswordOrEmail =
  (data, password) => async (dispatch, getState) => {
    dispatch(changeRequested());

    try {
      if (password) {
        await authService.updatePassword({
          email: data.email,
          password
        });
      }
      if (data.email !== getSignedUser()(getState()).email) {
        await authService.updateEmail({
          ...data,
          oldEmail: getSignedUser()(getState()).email
        });
      }

      dispatch(changeUserParams(data));
    } catch (error) {
      const { message, code } = error.response.data.error;

      if (code === 400) {
        const errorMessage = generateAuthError(message);
        dispatch(changeRequestedFailed(errorMessage));
      } else {
        dispatch(changeRequestedFailed(error.message));
      }
    }
  };

export const getAuthError = () => (state) => state.user.signInError;
export const getLogInError = () => (state) => state.user.logInError;
export const getChangeError = () => (state) => state.user.changeError;
export const getUserIsLoading = () => (state) => state.user.isLoading;
export const getUserIsLoggedIn = () => (state) => state.user.isLoggedIn;

export default userReducer;
