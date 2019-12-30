import React, { Component } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";
// import TimelineService from "./../services/timelineService";

const urlEndPoint = apiUrl;
// const tokenKey = "token";

class Feed extends Component {
  state = {
    posts: []
  };
  componentDidMount() {
    this.getFeeds();
  }

  getFeeds = () => {
    const requestBody = {
      query: `
          query{
            allPost {
              id
              post
              creatorPostId
              creatorPost{
                username
              }
              comments{
                id
                comment
                creatorComment{
                  username
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
        const feed = data.data.allPost;
        this.setState({ posts: feed });
        console.log("this.state.posts: ", this.state.posts);
        // console.log(
        //   "this.state.posts[0].comments[0].comment: ",
        //   this.state.posts[0].comments[0].comment
        // );
      });
  };

  render() {
    return (
      <table>
        {this.state.posts.map(post => (
          <tbody key={post.id} className="card-body card mb-3">
            <tr className="d-flex align-items-center">
              <td className="border-0 d-flex flex-column mr-2">
                <Link to="/about" className="post-photo"></Link>
              </td>
              <td className="d-flex flex-column border-0">
                <Link to="/about" className="post-name">
                  {post.creatorPost.username}
                </Link>
                <span className="post-time">1 hour ago</span>
              </td>
            </tr>
            <tr className="mt-2 mb-2">
              <td className="mt-20 mb-20 post-message border-0">{post.post}</td>
            </tr>
            <tr className="d-flex border-bottom border-top">
              <td className="w-100">
                <button
                  type="button"
                  className="btn btn-light rounded-0 float-left w-50"
                >
                  Comment
                </button>
                <button
                  type="button"
                  className="btn btn-light rounded-0 float-right w-50"
                >
                  Like
                </button>
              </td>
            </tr>
            {post.comments.length > 0 &&
              post.comments.map(comment => (
                <tr
                  className="d-flex align-items-center mt-2 mb-2"
                  key={comment.id}
                >
                  <td className="border-0 d-flex flex-column align-self-start">
                    <Link to="/about" className="comment-photo mr-2"></Link>
                  </td>
                  <td className="comment-message border-0 p-2">
                    <strong> {comment.creatorComment.username} </strong>
                    {comment.comment}
                  </td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
    );
  }
}

export default Feed;

// post.comments.map(comment => (
//   <tr className="mt-2 mb 2" key={comment.id}>
//     <td className="comment-message border-0 bg-light">
//       {comment.comment}
//     </td>
//   </tr>
// ))
