import React, { Component } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";
// import service from "../services/service";

const urlEndPoint = apiUrl;
// const tokenKey = "token";

class Feed extends Component {
  state = {
    posts: []
  };

  constructor(props) {
    super(props);
    this.createPost = React.createRef();
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
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
      });
  };

  // createPost = () => {
  //   const requestBody = {
  //     query: `
  //         query{
  //           allPost {
  //             id
  //             post
  //             creatorPostId
  //             creatorPost{
  //               username
  //             }
  //             comments{
  //               id
  //               comment
  //               creatorComment{
  //                 username
  //               }
  //             }
  //           }
  //         }
  //       `
  //   };

  //   fetch(urlEndPoint, {
  //     method: "POST",
  //     body: JSON.stringify(requestBody),
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   })
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(data => {
  //       const feed = data.data.allPost;
  //       this.setState({ posts: feed });
  //       console.log("this.state.posts: ", this.state.posts);
  //     });
  // };

  // handleSubmit = event => {
  //   event.preventDefault();
  //   const createPost = this.createPost.current.value;
  //   console.log(createPost);
  // };

  render() {
    return (
      <table className="w-100">
        <thead className="card-body card mb-3">
          <tr className="d-flex">
            <td className="w-100">
              <button
                type="button"
                className="btn btn-link"
                data-toggle="modal"
                data-target="#createPostModal"
              >
                <strong>Create a Post</strong>
              </button>
              <div
                className="modal fade"
                id="createPostModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="createPostModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="createPostModalLabel">
                        Create a Post
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-group modal-body">
                        <textarea
                          className="form-control fixed"
                          id="createPost"
                          placeholder="What do you think?"
                          ref={this.createPost}
                          rows="7"
                        ></textarea>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </thead>
        {this.state.posts.map(post => (
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
                    <Link
                      to={`/profile/${comment.creatorComment.username}`}
                      className="comment-photo mr-2"
                    ></Link>
                  </td>
                  <td className="comment-message border-0 p-2">
                    <Link to={`/profile/${comment.creatorComment.username}`}>
                      <strong>{comment.creatorComment.username} </strong>
                    </Link>
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
