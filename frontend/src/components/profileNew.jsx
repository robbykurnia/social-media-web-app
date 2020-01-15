import React, { Component } from "react";
import _ from "lodash";
import ProfileFeed from "./profileFeed";
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
      return this.componentDidMount();
    }
  }

  // FIX & little bit change
  showCreatePost = () => {
    if (!this.props.user) return this.setState({ showCreatePost: false });
    this.props.user.user.username === this.props.match.params.username
      ? this.setState({ showCreatePost: true })
      : this.setState({ showCreatePost: false });
  };

  // FIX
  handleGetPosts = () => {
    getPosts(this.props.match.params.username).then(data => {
      console.log("data:", data);
      try {
        const feeds = data.data.getUser;
        this.setState({ usernameThisProfile: feeds.username });
        this.setState({ idThisProfile: feeds.id });
        this.setState({ posts: feeds.posts });
        const posts = [...this.state.posts];
        const icon = [
          ...posts.map(post => {
            const groupLikes = _.groupBy(post.likes, "creatorLikesId");
            console.log("groupLikes:", groupLikes);
            if (groupLikes[this.props.user.user.id]) {
              const isLike = groupLikes[this.props.user.user.id][0].like;
              return { ...post, iconLikes: isLike };
            }
            if (post.likes.length > 0 || post.likes.length === 0) {
              return { ...post, iconLikes: false };
            }
          })
        ];
        this.setState({ posts: icon });
        console.log("\n\n\n\n\n\n\n\nicon di getpsot:", icon);
        // const indexStatePosts = _.findIndex(posts, post);
        // const objStatePostsLikes = _.groupBy(
        //   posts[indexStatePosts].likes,
        //   "creatorLikesId"
        // )[this.props.user.user.id];
        // console.log("objStatePostsLikes:", objStatePostsLikes);
        // const indexStatePostsLikes = objStatePostsLikes
        //   ? _.findIndex(posts[indexStatePosts].likes, objStatePostsLikes[0])
        //   : console.log("objStatePostsLikes not found");
        // console.log("indexStatePostsLikes:", indexStatePostsLikes);
      } catch (error) {
        return this.setState({ NotFound: true });
      }
    });
  };

  // FIX
  handleGetCommentsLikes = () => {
    getCommentsLikes(this.props.match.params.username).then(data => {
      console.log("data:", data);
      try {
        const comments = data.data.getUser.posts;
        const likes = data.data.getUser.posts;
        const bankComment = [];
        const bankLike = [];
        comments.map(c => c.comments.map(item => bankComment.push(item)));
        likes.map(l => l.likes.map(item => bankLike.push(item)));
        this.setState({ comments: bankComment });
        this.setState({ likes: bankLike });
      } catch (error) {
        return this.setState({ NotFound: true });
      }
    });
  };

  // FIX
  handleDeletePost = post => {
    // Using Pesimis
    deletePost(post.id).then(data => {
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
    deleteComment(comment.id).then(data => {
      console.log("data:", data);
      try {
        if (data.data) {
          const comments = this.state.comments.filter(c => c !== comment);
          this.setState({ comments });
        }
      } catch (error) {
        throw new Error("data no found");
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
          throw new Error("data no found");
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
    const onlyWhiteSpace = !messageInput || !messageInput.match(/[\S]/);
    if (onlyWhiteSpace) return;

    createPost(propsUserId, messageInput).then(data => {
      console.log("data:", data);
      try {
        const feed = data.data.createPost;
        const addIconLike = { ...feed, iconLikes: false };
        this.setState({ nextPosts: this.state.posts.push(addIconLike) });
      } catch (error) {
        throw new Error("data no found");
      }
    });

    this.setState({ reset: true });
    setTimeout(() => this.setState({ reset: false }), 100);
  };

  handleUpdateOrCreateLike = post => {
    const likes = [...this.state.likes];
    console.log("likes:", likes);
    console.log("post.likes:", post.likes);
    if (post.likes) {
      if (post.likes && post.likes.length > 0) {
        // ada bug di likes.lenght > 0 dan post tersebut di like orang lain
        // masalah ketika ingin mengganti likes yg terdapat pada state posts
        // dengan menggunakan id sendiri, padahal disana hanya ada likes orag tersebut
        // sehingga id yg digunakan menyebabkan error

        const posts = [...this.state.posts];
        const indexStatePosts = _.findIndex(posts, post);
        // const objStatePostsLikes = _.groupBy(
        //   posts[indexStatePosts].likes,
        //   "creatorLikesId"
        // )[this.props.user.user.id][0];
        // const indexStatePostsLikes = _.findIndex(
        //   posts[indexStatePosts].likes,
        //   objStatePostsLike
        // );
        const objStatePostsLikes = _.groupBy(
          posts[indexStatePosts].likes,
          "creatorLikesId"
        )[this.props.user.user.id];
        const indexStatePostsLikes = objStatePostsLikes
          ? _.findIndex(posts[indexStatePosts].likes, objStatePostsLikes[0])
          : null;
        console.log("indexStatePostsLikes:", indexStatePostsLikes);

        const groupPostLikes = _.groupBy(post.likes, "creatorLikesId");
        const alreadyLikes = groupPostLikes[this.props.user.user.id];
        if (alreadyLikes) {
          console.log("already likes");
          // fix ketika owner nya sudah pernah like
          const groupStateLike = _.groupBy(likes, "creatorLikesId");
          const indexStateLike = _.findIndex(
            groupStateLike[this.props.user.user.id],
            { postId: post.id }
          );
          const objLikes =
            groupStateLike[this.props.user.user.id][indexStateLike];
          const indexLikes = _.findIndex(likes, objLikes);
          const like = !objLikes.like;
          updateOrCreateLike(this.props.user.user.id, post.id, like).then(
            data => {
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
            }
          );
        } else {
          console.log("has not already likes");
          const posts = [...this.state.posts];
          const indexPosts = _.findIndex(posts, post);
          console.log("indexPosts:", indexPosts);
          const like = true;

          updateOrCreateLike(this.props.user.user.id, post.id, like).then(
            data => {
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
            }
          );
        }
        console.log("\n\n\npost.likes:", post.likes);
        console.log(
          "\n\n\n\n\ngroupPostLikes:",
          groupPostLikes[this.props.user.user.id]
        );
        return;
        // bug ketika owner nya belum pernah like dan likes > 0
      } else {
        console.log("else");
        const posts = [...this.state.posts];
        const indexStatePosts = _.findIndex(posts, post);
        const like = true;

        updateOrCreateLike(this.props.user.user.id, post.id, like).then(
          data => {
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
          }
        );
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
            usernameThisProfile={this.state.usernameThisProfile}
            idThisProfile={this.state.idThisProfile}
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
        )}
      </React.Fragment>
    );
  }
}

export default Profile;
