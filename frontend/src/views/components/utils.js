import axios from "axios";

export function onInputChange(state, setState, event, keys) {
  setState({
    ...state,
    [keys]: event ? event.target.value : "",
  });
}

export async function fetchFirstData(url, authorization = "") {
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem("authorization_token") || ""
      }`,
    },
  });
}

export function searchFilter(state, setState) {
  setState(!state);
}
