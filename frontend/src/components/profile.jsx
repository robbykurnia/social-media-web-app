import React, { Component } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";

const urlEndPoint = apiUrl;

class Profile extends Component {
  state = {
    posts: []
  };

  componentDidMount() {
    this.getFeeds();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.componentDidMount();
    }
  }

  getFeeds = () => {
    const requestBody = {
      query: `
          query{
            getUser(input:{username:${JSON.stringify(
              this.props.match.params.username
            )}}) {
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
  };

  render() {
    return (
      <div>
        <h1>{this.props.match.params.username}</h1>
        <table className="w-100">
          {Object.assign(
            [],
            this.state.posts.map(post => (
              <tbody key={post.id} className="card-body card mb-3">
                <tr className="d-flex align-items-center">
                  <td className="border-0 d-flex flex-column mr-2">
                    <Link to="/about" className="post-photo"></Link>
                  </td>
                  <td className="d-flex flex-column border-0">
                    <Link
                      to={`/profile/${post.creatorPost.username}`}
                      className="post-name"
                    >
                      {post.creatorPost.username}
                    </Link>
                    <span className="post-time">1 hour ago</span>
                  </td>
                </tr>
                <tr className="mt-2 mb-2">
                  <td className="mt-20 mb-20 post-message border-0">
                    {post.post}
                  </td>
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
                        <Link
                          to={`/profile/${comment.creatorComment.username}`}
                          className="comment-photo mr-2"
                        ></Link>
                      </td>
                      <td className="comment-message border-0 p-2">
                        <Link
                          to={`/profile/${comment.creatorComment.username}`}
                        >
                          <strong>{comment.creatorComment.username} </strong>
                        </Link>
                        {comment.comment}
                      </td>
                    </tr>
                  ))}
              </tbody>
            ))
          ).reverse()}
        </table>
      </div>
    );
  }
}

export default Profile;
