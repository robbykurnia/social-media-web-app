import React, { Component } from "react";
import _ from "lodash";
import ProfileFeed from "./profileFeed";
import SwalAlert from "../services/SwalAlert";
import ProfileNotFound from "./common/profileNotFound";
import {
  getPosts,
  getCommentsLikes,
  createPost,
  createComment,
  deletePost,
  deleteComment,
  updateOrCreateLike
} from "../services/service";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.createPostInput = "";
    this.state = {
      posts: [],
      comments: [],
      likes: [],
      showCreatePost: false,
      reset: false,
      disablePostButton: true
    };
  }

  // FIX
  componentDidMount() {
    console.log("call componentDidMount()");
    if (!this.props.match.params.username) {
      if (this.props.user)
        return (window.location = `/profile/${this.props.user.user.username}`);
      return (window.location = "/login");
    }
    this.showCreatePost();
    this.handleGetPosts();
    this.handleGetCommentsLikes();
    window.scrollTo(0, 0);
  }

  // FIX
  componentDidUpdate(prevProps, prevState) {
    console.log("call componentDidUpdate");
    // re-fetching data in current page with different user (not full reload)
    if (prevProps.match.params.username !== this.props.match.params.username) {
      console.log("call componentDidUpdate different user");
      this.setState({ posts: [] });
      this.setState({ usernameThisProfile: null });
      return this.componentDidMount();
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("call shouldComponentUpdate");
  //   console.log("nextState di SCU:", nextState);
  //   console.log("this.state di SCU:", this.state);
  //   console.log("nextProps.location di SCU:", nextProps);
  //   console.log("this.props.location di SCU:", this.props);
  //   return nextProps === this.props;
  // }

  // FIX
  UNSAFE_componentWillReceiveProps(nextProps) {
    // re-fetching data in current page with same user (not full reload)
    if (nextProps.location.state === this.props.match.params.username) {
      console.log("call componentWillReceiveProps");
      // window.scrollTo(0, 0);
      return this.componentDidMount();
    }
  }

  // FIX & little bit change
  showCreatePost = () => {
    if (!this.props.user) return this.setState({ showCreatePost: false });
    // delete "const currentUserProfile ="
    this.props.user.user.username === this.props.match.params.username
      ? this.setState({ showCreatePost: true })
      : this.setState({ showCreatePost: false });
  };

  // FIX & Need comment count
  handleGetPosts = () => {
    getPosts(this.props.match.params.username)
      .then(res => {
        console.log("res: ", res);
        return res.json();
      })
      .then(data => {
        console.log("data:", data);
        try {
          const feeds = data.data.getUser;
          this.setState({ usernameThisProfile: feeds.username });
          this.setState({ posts: feeds.posts });
        } catch (error) {
          return this.setState({ NotFound: true });
        }
      });
  };

  // FIX
  handleGetCommentsLikes = () => {
    getCommentsLikes(this.props.match.params.username)
      .then(res => {
        console.log("res: ", res);
        return res.json();
      })
      .then(data => {
        console.log("data:", data);
        try {
          const comments = data.data.getUser.posts;
          const likes = data.data.getUser.posts;
          const bankComment = [];
          const bankLike = [];
          comments.map(c => c.comments.map(item => bankComment.push(item)));
          this.setState({ comments: bankComment });
          likes.map(l => l.likes.map(item => bankLike.push(item)));
          this.setState({ likes: bankLike });
          console.log("comments:", comments);
          console.log("likes:", likes);
          console.log("bankComment:", bankComment);
          console.log("bankLike:", bankLike);
        } catch (error) {
          return error;
        }
      });
  };

  // FIX
  handleDeletePost = post => {
    // Using Pesimis
    deletePost(post.id)
      .then(res => {
        if (res.status >= 400 && res.status < 500) {
          return SwalAlert.warning(`${res.status} ${res.statusText}`, "error");
        }
        return res.json();
      })
      .then(data => {
        try {
          if (data.data) {
            const posts = this.state.posts.filter(p => p.id !== post.id);
            this.setState({ posts });
          }
        } catch (error) {
          throw new Error("data no found");
        }
      });
  };

  handleDeleteComment = comment => {
    // Using Pesimis
    deleteComment(comment.id)
      .then(res => {
        console.log("res:", res);
        if (res.status >= 400 && res.status < 500) {
          return SwalAlert.warning(`${res.status} ${res.statusText}`, "error");
        }
        return res.json();
      })
      .then(data => {
        console.log("data:", data);
        try {
          if (data.data) {
            const comments = this.state.comments.filter(c => c !== comment);
            this.setState({ comments });
          }
        } catch (error) {
          return;
        }
      });
  };

  //
  handleCreateComment = (e, postId) => {
    // Using Pesimis
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      const messageInput = e.currentTarget.value;
      const propsUserId = this.props.user.user.id;
      const onlyWhiteSpace = !messageInput || !messageInput.match(/[\S]/);
      if (onlyWhiteSpace) return;

      // call database
      createComment(propsUserId, postId, messageInput)
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
          // jika tidak berhasil buat toastify untuk pemberitahuan pesan gagal dikirim
          const feed = data.data.createComment;
          this.setState({ nextComments: this.state.comments.push(feed) });
          console.log("feed:", feed);
          console.log("this.state.comments: ", this.state.comments);
          console.log("this.state.nextComments: ", this.state.nextComments);
          return;
        });

      console.log("submitted");
      console.log("input:", messageInput);
      return (
        (e.currentTarget.value = null), (e.currentTarget.style.height = "27px")
      );
    }
  };

  // FIX & onChangePostInput like postInput
  onChangePostInput = e => {
    const input = e.currentTarget.value;
    this.createPostInput = input;
  };

  // Need call database
  handleCreatePost = event => {
    // Using Pesimis
    event.preventDefault();
    const propsUserId = this.props.user.user.id;
    const messageInput = this.createPostInput;
    const onlyWhiteSpace = !messageInput || !messageInput.match(/[\S]/);
    if (onlyWhiteSpace) return;
    console.log("messageInput:", messageInput);

    createPost(propsUserId, messageInput)
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
        // jika tidak berhasil buat toastify untuk pemberitahuan pesan gagal dikirim
        // NOTE: belum ditambahkan tutup model setelah berhasil mengirim message
        const feed = data.data.createPost;
        this.setState({ nextPosts: this.state.posts.push(feed) });

        console.log("this.state.posts: ", this.state.posts);
        console.log("this.state.nextPosts: ", this.state.nextPosts);
        return;
      });

    // call database
    // if res.status => 400 && res.status < 500
    // return errormassage

    this.setState({ reset: true });
    setTimeout(() => this.setState({ reset: false }), 100);
  };

  handleUpdateOrCreateLike = post => {
    const likes = [...this.state.likes];
    console.log("likes:", likes);
    if (post.likes) {
      if (post.likes && post.likes.length > 0) {
        console.log("(post.likes && post.likes.length > 0)");
        console.log("lebih dari 0");
        const groupStateLike = _.groupBy(likes, "creatorLikesId");
        const indexStateLike = _.findIndex(
          groupStateLike[this.props.user.user.id],
          { postId: post.id }
        );
        const objLikes =
          groupStateLike[this.props.user.user.id][indexStateLike];
        const indexLikes = _.findIndex(likes, objLikes);
        console.log("groupStateLike:", groupStateLike);
        console.log("indexStateLike:", indexStateLike);
        console.log("objLikes:", objLikes);
        console.log("likes:", likes);
        console.log("indexLikes:", indexLikes);
        const like = !objLikes.like;
        console.log("like:", like);

        updateOrCreateLike(this.props.user.user.id, post.id, like)
          .then(res => {
            console.log("res: ", res);
            if (res.ok === false) {
              // segera diganti dengan toastify
              console.log(res.statusText);
            }
            return res.json();
          })
          .then(data => {
            console.log("data di UOCL:", data);
            console.log(
              "data.data.updateOrCreateLike:",
              data.data.updateOrCreateLike
            );
            const update = data.data.updateOrCreateLike;
            const bankLikes = [...likes];
            bankLikes[indexLikes] = update;
            this.setState({ likes: bankLikes });
            // likes = [...bankLikes];
            console.log(bankLikes);
            console.log(likes);
            // jika tidak berhasil buat toastify untuk pemberitahuan pesan gagal dikirim
            // const feed = data.data.createComment;
            // this.setState({ nextComments: this.state.comments.push(feed) });
            // console.log("feed:", feed);
            // console.log("this.state.comments: ", this.state.comments);
            // console.log("this.state.nextComments: ", this.state.nextComments);
            return;
          });
      }
      // if (post.likes.length === 0)
      else {
        console.log("(post.likes.length === 0)");
        console.log("post.likes.length =", post.likes.length);
        console.log("post:", post);
        const posts = [...this.state.posts];
        console.log("posts:", posts);
        const indexPosts = _.findIndex(posts, post);
        console.log("indexPosts:", indexPosts);

        const like = true;
        // KONDISI:
        // 1. ARRAY LIKES = 0
        // 2. LIKES HAVE OWN STATE
        // 3. ICON LIKES BERDASARKAN LIKES STATE
        // ALGORIMA :
        // 1. RUN QUERY -> ok
        // 2. MAKE CLONE LIKES STATE -> likes
        // 3. PUSH RESULT QUERY TO CLONE LIKES STATE
        // 4. SETSTATE LIKESTATE : CLONE LIKE STATE
        updateOrCreateLike(this.props.user.user.id, post.id, like)
          .then(res => {
            console.log("res: ", res);
            if (res.ok === false) {
              console.log(res.statusText);
            }
            return res.json();
          })
          .then(data => {
            console.log("data di UOCL:", data);
            console.log(
              "data.data.updateOrCreateLike:",
              data.data.updateOrCreateLike
            );
            const update = data.data.updateOrCreateLike;
            const bankLikes = likes.concat(update);
            posts[indexPosts].likes[0] = update;
            console.log("post.likes.length:", post.likes.length);
            this.setState({ likes: bankLikes });
            this.setState({ posts });
            console.log("likes:", likes);
            console.log("posts:", posts);
            console.log("bankLikes:", bankLikes);
            return;
          });
      }
      return;
    } else {
      console.log("array 0, perlu ditambahkan propsuserid,postId,like");
    }

    // updateOrCreateLike(this.props.user.user.id, post.id, post.like)
    //   .then(res => {
    //     console.log("res: ", res);
    //     if (res.ok === false) {
    //       // segera diganti dengan toastify
    //       console.log(res.statusText);
    //     }
    //     return res.json();
    //   })
    //   .then(data => {
    //     console.log("data:", data);
    //     // jika tidak berhasil buat toastify untuk pemberitahuan pesan gagal dikirim
    //     // const feed = data.data.createComment;
    //     // this.setState({ nextComments: this.state.comments.push(feed) });
    //     // console.log("feed:", feed);
    //     // console.log("this.state.comments: ", this.state.comments);
    //     // console.log("this.state.nextComments: ", this.state.nextComments);
    //     return;
    //   });
    console.log(post);

    // const posts = [...this.state.posts];
    // const indexPost = posts.indexOf(post);
    // posts[indexPost] = { ...posts[indexPost] };
    // const groupPostLike = _.groupBy(post.likes, "creatorLikesId");
    // const indexPostLike = posts[indexPost].likes.indexOf(
    //   groupPostLike[this.props.user.user.id][0]
    // );
    // posts[indexPost].likes[indexPostLike].like = !posts[indexPost].likes[
    //   indexPostLike
    // ].like;
    // this.setState({ posts });
    // console.log("posts[indexPost] :", posts[indexPost]);
    // console.log("posts[indexPost].likes :", posts[indexPost].likes);
    // console.log("indexPost:", indexPost);
    // console.log("post.likes:", post.likes);
    // console.log("groupPostLike:", groupPostLike);
    // console.log("indexPostLike:", indexPostLike);
    // console.log("indexPostLike[0]:", indexPostLike[0]);
    // console.log("post.likes[0]:", post.likes[0]);
    // console.log(
    //   "posts[indexPost].likes[0].like:",
    //   posts[indexPost].likes[0].like
    // );
    // console.log("posts:", posts);
    // console.log(
    //   "posts[indexPost].likes[indexPostLike].like :",
    //   posts[indexPost].likes[indexPostLike].like
    // );
    // console.log("likes:", likes);
    // return likes;

    // ==================================================

    // createComment(propsUserId, postId, messageInput)
    //     .then(res => {
    //       console.log("res: ", res);
    //       if (res.ok === false) {
    //         // segera diganti dengan toastify
    //         console.log(res.statusText);
    //       }
    //       return res.json();
    //     })
    //     .then(data => {
    //       console.log("data:", data);
    //       // jika tidak berhasil buat toastify untuk pemberitahuan pesan gagal dikirim
    //       const feed = data.data.createComment;
    //       this.setState({ nextComments: this.state.comments.push(feed) });
    //       console.log("feed:", feed);
    //       console.log("this.state.comments: ", this.state.comments);
    //       console.log("this.state.nextComments: ", this.state.nextComments);
    //       return;
    //     });
  };

  render() {
    console.log("this.state in render:", this.state);
    // if (service.getCurrentUser()) return <Redirect to="/feed" />;

    return (
      <React.Fragment>
        {this.state.NotFound && (
          <ProfileNotFound
            username={this.props.match.params.username}
            login={this.props.user}
          />
        )}
        {!this.state.NotFound && <h1>{this.state.usernameThisProfile}</h1>}
        {/* ProfileFeed component will be change to Feed component */}
        <ProfileFeed
          // props={this.props}
          user={this.props.user.user}
          showCreatePost={this.state.showCreatePost}
          reset={this.state.reset}
          posts={this.state.posts}
          comments={this.state.comments}
          likes={this.state.likes}
          handleDeletePost={this.handleDeletePost}
          handleDeleteComment={this.handleDeleteComment}
          handleUpdatePost={this.handleUpdatePost}
          handleUpdateComment={this.handleUpdateComment}
          handleCreatePost={this.handleCreatePost}
          handleCreateComment={this.handleCreateComment}
          handleUpdateOrCreateLike={this.handleUpdateOrCreateLike}
          createPostInput={this.createPostInput}
          createCommentInput={this.createCommentInput}
          onChangePostInput={this.onChangePostInput}
          onChangeCommentInput={this.onChangeCommentInput}
        />
      </React.Fragment>
    );
  }
}

export default Profile;

// handleCreatePost = event => {
//   event.preventDefault();
//   // let messagePost = this.createPost.current.value;
//   let messagePost = this.createPost.current.value;
//   console.log("messagePost: ", messagePost);
//   if (messagePost.length === 0) return;
//   const requestBody = {
//     query: `
//         mutation{
//           createPost(input:{creatorPostId:${this.props.user.user.id}, post:"""${messagePost}"""})
//           {
//             id
//             post
//             creatorPost{
//               username
//             }
//             comments {
//               id
//               comment
//               creatorComment {
//                 id
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
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: localStorage.getItem(tokenKey)
//     }
//   })
//     .then(res => {
//       console.log("res: ", res);
//       if (res.ok === false) {
//         // segera diganti dengan toastify
//         console.log(res.statusText);
//       }
//       return res.json();
//     })
//     .then(data => {
//       console.log("data:", data);
//       // jika message telah di post dan telah berhasil dimasukkan kedalam database,
//       // maka tutup model (bersihkan text), dan refetch data.
//       // jika tidak berhasil buat toastify untuk pemberitahuan pesan gagal dikirim
//       // NOTE: belum ditambahkan tutup model setelah berhasil mengirim message
//       const feed = data.data.createPost;
//       this.setState({ nextPosts: this.state.posts.push(feed) });
//       this.createPost.current.value = null;

//       console.log("this.state.posts: ", this.state.posts);
//       console.log("this.state.nextPosts: ", this.state.nextPosts);
//       return;
//     });
// };
