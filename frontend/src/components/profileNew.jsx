import React, { Component } from "react";
import _ from "lodash";
import ProfileFeed from "./profileFeed";
import ProfileNotFound from "./common/profileNotFound";
import {
  getPosts,
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
      disablePostButton: true,
      lastId: null
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
    // this.handleGetCommentsLikes();
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
      this.setState({ lastId: null });
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
      this.setState({ lastId: null });
      console.log("call componentWillReceiveProps");
      return this.componentDidMount();
    }
  }

  // FIX
  showCreatePost = () => {
    if (!this.props.user) return this.setState({ showCreatePost: false });
    this.props.user.user.username === this.props.match.params.username
      ? this.setState({ showCreatePost: true })
      : this.setState({ showCreatePost: false });
  };

  // handleGetPostLastId = () => {
  //   getPostLastId(this.props.match.params.username).then(data => {
  //     console.log("\n\n\n\n\n\n\n\n\n data", data);
  //     try {
  //       const feeds = data.data.getUser;
  //       const lastId = feeds.posts[feeds.posts.length - 1];
  //       return this.setState({ lastId });
  //     } catch (error) {
  //       return this.setState({ NotFound: true });
  //     }
  //   });
  // };

  // FIX
  handleGetPosts = () => {
    getPosts(this.props.match.params.username, this.state.lastId).then(data => {
      console.log("data:", data);
      try {
        // add older post
        // kondisi
        // 1. post:
        //      1. post telah tesedia
        //      2. property iconLikes telah tersedia
        //      3. older post belum di push
        // 2. problem:
        //      state post sudah memiliki property iconLikes,
        //      sedangkan new feeds belum memiliki iconLikes
        // 3. solving:
        //      1. clone state post
        //      2. add propery iconLikes di new feeds
        //      3. push new feeds ke clone state post
        //      4. setState clone state post
        const feeds = data.data.getUser;
        const posts = data.data.getUser.somePosts;
        const comments = data.data.getUser.somePosts;
        const likes = data.data.getUser.somePosts;
        const bankPosts = [this.state.posts];
        const bankComment = [];
        const bankLike = [];
        const olderPosts = [];
        const index = feeds.somePosts.length - 1;
        const limit = 10;
        const disableLoad =
          posts.length < limit
            ? this.setState({ disableLoad: true })
            : this.setState({ disableLoad: false });
        comments.map(c => c.comments.map(item => bankComment.push(item)));
        likes.map(l => l.likes.map(item => bankLike.push(item)));

        this.setState({ usernameThisProfile: feeds.username });
        this.setState({ idThisProfile: feeds.id });
        // this.setState({ posts: feeds.somePosts }); // letakkan setelah new output memilikin propery iconLikes
        this.setState({ comments: bankComment });
        this.setState({ likes: bankLike });
        const lastId =
          posts.length > 0
            ? this.setState({
                lastId: feeds.somePosts[index].id
              })
            : null;

        // this.setState({
        //   lastId: feeds.somePosts[feeds.somePosts.length - 1].id
        // });

        // add property iconLikes
        // const posts = [...this.state.posts];
        const icon = [
          ...posts.map(post => {
            const groupLikes = _.groupBy(post.likes, "creatorLikesId");

            if (groupLikes[this.props.user.user.id]) {
              const isLike = groupLikes[this.props.user.user.id][0].like;
              return { ...post, iconLikes: isLike };
            }
            if (post.likes.length > 0 || post.likes.length === 0) {
              return { ...post, iconLikes: false };
            }
          })
        ];
        if (bankPosts.length !== 0) {
          bankPosts[0].map(post => olderPosts.push(post));
        }
        icon.map(i => olderPosts.push(i));
        this.setState({ posts: olderPosts });
      } catch (error) {
        throw error;
        return this.setState({ NotFound: true });
      }
    });
  };

  // using later
  // handleGetCommentsLikes = () => {
  //   getCommentsLikes(this.props.match.params.username, this.state.lastId).then(
  //     data => {
  //       console.log("data:", data);
  //       try {
  //         const comments = data.data.getUser.somePosts;
  //         const likes = data.data.getUser.somePosts;
  //         const bankComment = [];
  //         const bankLike = [];

  //         comments.map(c => c.comments.map(item => bankComment.push(item)));
  //         likes.map(l => l.likes.map(item => bankLike.push(item)));

  //         this.setState({ comments: bankComment });
  //         this.setState({ likes: bankLike });
  //       } catch (error) {
  //         return this.setState({ NotFound: true });
  //       }
  //     }
  //   );
  // };

  handleDeletePost = post => {
    // Using Pesimis
    deletePost(post.id).then(data => {
      try {
        if (data.data) {
          const posts = this.state.posts.filter(p => p.id !== post.id);
          this.setState({ posts });
        }
      } catch (error) {
        throw new Error("data not found");
      }
    });
  };

  handleDeleteComment = comment => {
    // Using Pesimis
    deleteComment(comment.id).then(data => {
      console.log("data:", data);
      try {
        if (data.data) {
          const comments = this.state.comments.filter(c => c !== comment);
          this.setState({ comments });
        }
      } catch (error) {
        throw new Error("data not found");
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
      createComment(propsUserId, postId, messageInput).then(data => {
        console.log("data:", data);
        try {
          const feed = data.data.createComment;
          this.setState({ nextComments: this.state.comments.push(feed) });
        } catch (error) {
          throw new Error("data not found");
        }
      });

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
    console.log("this.createPostInput:", this.createPostInput);
    const onlyWhiteSpace = !messageInput || !messageInput.match(/[\S]/);
    if (onlyWhiteSpace) return;

    createPost(propsUserId, messageInput).then(data => {
      console.log("data:", data);
      try {
        const feed = data.data.createPost;
        const addIconLike = { ...feed, iconLikes: false };

        this.createPostInput = "";
        this.setState({ nextPosts: this.state.posts.unshift(addIconLike) });
      } catch (error) {
        throw new Error("data not found");
      }
    });

    this.setState({ reset: true });
    setTimeout(() => this.setState({ reset: false }), 100);
  };

  handleUpdateOrCreateLike = post => {
    const likes = [...this.state.likes];
    const { id } = this.props.user.user;

    if (post.likes) {
      if (post.likes && post.likes.length > 0) {
        const posts = [...this.state.posts];
        const indexStatePosts = _.findIndex(posts, post);
        const objStatePostsLikes = _.groupBy(
          posts[indexStatePosts].likes,
          "creatorLikesId"
        )[id];
        const indexStatePostsLikes = objStatePostsLikes
          ? _.findIndex(posts[indexStatePosts].likes, objStatePostsLikes[0])
          : null;

        const groupPostLikes = _.groupBy(post.likes, "creatorLikesId");
        const alreadyLikes = groupPostLikes[id];
        if (alreadyLikes) {
          console.log("already likes");
          // fix ketika owner nya sudah pernah like
          const groupStateLike = _.groupBy(likes, "creatorLikesId");
          const indexStateLike = _.findIndex(groupStateLike[id], {
            postId: post.id
          });
          const objLikes = groupStateLike[id][indexStateLike];
          const indexLikes = _.findIndex(likes, objLikes);
          const like = !objLikes.like;
          updateOrCreateLike(id, post.id, like).then(data => {
            try {
              const update = data.data.updateOrCreateLike;
              const bankLikes = [...likes];

              if (objStatePostsLikes) {
                posts[indexStatePosts].likes[indexStatePostsLikes] = update;
                posts[indexStatePosts].iconLikes = update.like;
                this.setState({ posts });
              }

              bankLikes[indexLikes] = update;
              this.setState({ likes: bankLikes });
              return;
            } catch (error) {
              throw new Error("data not found");
            }
          });
        } else {
          const posts = [...this.state.posts];
          const indexPosts = _.findIndex(posts, post);
          const like = true;

          updateOrCreateLike(id, post.id, like).then(data => {
            try {
              const update = data.data.updateOrCreateLike;
              const bankLikes = likes.concat(update);

              posts[indexPosts].likes[0] = update;
              posts[indexStatePosts].iconLikes = update.like;

              this.setState({ likes: bankLikes });
              this.setState({ posts });
              return;
            } catch (error) {
              throw new Error("data not found");
            }
          });
        }
        return;
        // bug ketika owner nya belum pernah like dan likes > 0
      } else {
        console.log("else");
        const posts = [...this.state.posts];
        const indexStatePosts = _.findIndex(posts, post);
        const like = true;

        updateOrCreateLike(id, post.id, like).then(data => {
          try {
            const update = data.data.updateOrCreateLike;
            const bankLikes = likes.concat(update);

            posts[indexStatePosts].likes[0] = update;
            posts[indexStatePosts].iconLikes = update.like;

            this.setState({ likes: bankLikes });
            this.setState({ posts });
            return;
          } catch (error) {
            throw new Error("data not found");
          }
        });
      }
      return;
    }
  };

  render() {
    console.log("this.state in render:", this.state);
    // if (service.getCurrentUser()) return <Redirect to="/feed" />;

    return (
      <React.Fragment>
        {(this.state.NotFound || !this.props.user) && (
          <ProfileNotFound
            username={this.props.match.params.username}
            login={this.props.user}
          />
        )}
        {/* ProfileFeed component will be change to Feed component */}

        {!this.state.NotFound && this.props.user && (
          <ProfileFeed
            // props={this.props}
            user={this.props.user.user}
            usernameThisProfile={this.state.usernameThisProfile}
            idThisProfile={this.state.idThisProfile}
            showCreatePost={this.state.showCreatePost}
            disableLoad={this.state.disableLoad}
            reset={this.state.reset}
            posts={this.state.posts}
            comments={this.state.comments}
            likes={this.state.likes}
            handleGetPosts={this.handleGetPosts}
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
        )}
      </React.Fragment>
    );
  }
}

export default Profile;
