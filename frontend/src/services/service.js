import jwtDecode from "jwt-decode";

import { apiUrl } from "../config.json";
const tokenKey = "token";
const urlEndPoint = apiUrl;

// export async function login(email, password) {
//   const requestBody = {
//     query: `
//       mutation{
//         login(input:{email:"${email}", password:"${password}"})
//       }
//     `
//   };

//   const data = await fetch(urlEndPoint, {
//     method: "POST",
//     body: JSON.stringify(requestBody),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//     .then(res => {
//       return res.json();
//     })
//     .then(user => {
//       if (user.errors) {
//         return alert(JSON.stringify(user.errors[0].message));
//       } else {
//         localStorage.setItem(tokenKey, JSON.stringify(user.data.login));
//         return (window.location = "/");
//       }
//     });
//   console.log("data:", data);
//   return data;
// }

// getFeeds(this.props.match.params.username)

export function getFeeds(propsUsername) {
  const username = JSON.stringify(propsUsername);
  const requestBody = {
    query: `
        query{
          getUser(input:{username:${username}}) {
            id
            username
            posts {
              id
              post
              creatorPost{
                username
              }
              comments {
                id
                comment
                creatorComment {
                  id
                  username
                }
              }
            }
          }
        }
      `
  };

  fetch(urlEndPoint, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      const feed = data.data.getUser;
      this.setState({ posts: feed.posts });
      console.log("this.state.posts.posts: ", this.state.posts);
    });
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    console.log(jwtDecode(jwt));
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export default {
  getFeeds,
  getCurrentUser,
  logout
  // login,
};
