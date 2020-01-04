import React, { Component } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";
import service from "../services/service";
import ProfileNotFound from "./common/profileNotFound";

const urlEndPoint = apiUrl;
const tokenKey = "token";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.createPost = React.createRef();
    this.state = {
      posts: [],
      showCreatePost: false
    };
  }
  // For jquery
  // handleAutoFocus = () => {
  //   $("#myModal").on("shown.bs.modal", function() {
  //     $("#myInput").trigger("focus");
  //   });
  // };

  componentDidMount() {
    if (!this.props.match.params.username) {
      if (this.props.user)
        return (window.location = `/profile/${this.props.user.user.username}`);
      return (window.location = "/login");
    }
    this.showCreatePost();
    this.getFeeds();
  }

  componentDidUpdate(prevProps, prevState) {
    // re-fetching data in current page with different user (not full reload)
    if (prevProps.match.params.username !== this.props.match.params.username) {
      return this.componentDidMount();
    }
  }

  componentWillReceiveProps(nextProps) {
    // re-fetching data in current page with same user (not full reload)
    if (nextProps.location.state === this.props.match.params.username) {
      console.log("next.Props di CWRP:", nextProps.location);
      console.log("this.props di CWRP:", this.props.location);
      return this.componentDidMount();
    }
  }

  showCreatePost = () => {
    if (!this.props.user) return this.setState({ showCreatePost: false });

    const currentUserProfile =
      this.props.user.user.username === this.props.match.params.username
        ? this.setState({ showCreatePost: true })
        : this.setState({ showCreatePost: false });

    // if (currentUserProfile) this.setState({ showCreatePost: true });
    // else this.setState({ showCreatePost: false });
  };

  handleCreatePost = event => {
    event.preventDefault();
    let message = this.createPost.current.value;
    const requestBody = {
      query: `
          mutation{
            createPost(input:{creatorPostId:${this.props.user.user.id}, post:"${message}"})
            {
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
        `
    };

    fetch(urlEndPoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(tokenKey)
      }
    })
      .then(res => {
        console.log("res: ", res);
        if (res.ok === false) {
          // segera diganti dengan toastify
          console.log(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        console.log("data:", data);
        // jika message telah di post dan telah berhasil dimasukkan kedalam database,
        // maka tutup model (bersihkan text), dan refetch data.
        // jika tidak berhasil buat toastify untuk pemberitahuan pesan gagal dikirim
        // NOTE: belum ditambahkan tutup model setelah berhasil mengirim message
        const feed = data.data.createPost;
        this.setState({ nextPosts: this.state.posts.push(feed) });
        this.createPost.current.value = null;

        console.log("this.state.posts: ", this.state.posts);
        console.log("this.state.nextPosts: ", this.state.nextPosts);
        return;
      });
  };

  getFeeds = () => {
    const username = JSON.stringify(this.props.match.params.username);
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
        console.log("res: ", res);
        return res.json();
      })
      .then(data => {
        console.log(data);
        try {
          const feed = data.data.getUser;
          this.setState({ usernameThisProfile: feed.username });
          this.setState({ posts: feed.posts });
          console.log("this.state.posts.posts: ", this.state.posts);
        } catch (error) {
          return this.setState({ NotFound: true });
        }
      });
  };

  render() {
    console.log();
    return (
      <React.Fragment>
        {this.state.NotFound && (
          <ProfileNotFound
            username={this.props.match.params.username}
            login={this.props.user}
          />
        )}
        {!this.state.NotFound && <h1>{this.state.usernameThisProfile}</h1>}
        <table className="w-100">
          {this.state.showCreatePost && (
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
                        <form onSubmit={this.handleCreatePost}>
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
                            <button
                              type="submit"
                              className="btn btn-primary"
                              // data-dismiss="modal"
                              // aria-label="Close"
                            >
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
          )}
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
                      to={{
                        pathname: `/profile/${post.creatorPost.username}`,
                        state: post.creatorPost.username
                      }}
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
      </React.Fragment>
    );
  }
}

export default Profile;
