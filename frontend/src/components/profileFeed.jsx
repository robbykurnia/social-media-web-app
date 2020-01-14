import React from "react";
import { Link } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import _ from "lodash";
import PostInput from "./common/postInput";

const ProfileFeed = ({
  showCreatePost,
  posts,
  comments,
  likes,
  user,
  handleCreatePost,
  handleCreateComment,
  handleDeletePost,
  handleDeleteComment,
  handleUpdateOrCreateLike,
  reset,
  onChangePostInput
}) => {
  const trueLikes = likes.filter(like => like.like === true);
  const countLikes = _.countBy(trueLikes, "postId");
  const countComment = _.countBy(comments, "postId");

  return (
    <table className="w-100">
      {showCreatePost && (
        <thead className="card-body card mb-3 p-0">
          <tr className="d-flex">
            <PostInput
              handleCreatePost={handleCreatePost}
              onChangePostInput={onChangePostInput}
              reset={reset}
            />
          </tr>
        </thead>
      )}
      {Object.assign(
        [],
        posts.map(post => (
          <tbody key={post.id} className="card-body card mb-3 p-2">
            <tr className="d-flex align-items-center">
              <td className="border-0 d-flex flex-column mr-2">
                <Link
                  to={{
                    pathname: `/profile/${post.creatorPost.username}`,
                    state: post.creatorPost.username
                  }}
                  className="post-photo"
                >
                  <img
                    className="post-photo"
                    src={`https://i.picsum.photos/id/${post.creatorPost.id}/300/300.jpg`}
                    alt="Profile"
                  />
                </Link>
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
                <span className="post-time">
                  {`${new Date(
                    Number(post.createdAt)
                  ).toLocaleTimeString()} ${new Date(
                    Number(post.createdAt)
                  ).toDateString()}`}
                </span>
              </td>
              {post.creatorPost.username === user.username && (
                <td className="ml-auto ellipsis">
                  <div>
                    <i
                      className="fa fa-ellipsis-h"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    ></i>
                    <div className="dropdown-menu dropdown-menu-right">
                      <li className="dropdown-item">Edit</li>
                      <li
                        className="dropdown-item"
                        onClick={() => handleDeletePost(post)}
                      >
                        Delete
                      </li>
                    </div>
                  </div>
                </td>
              )}
            </tr>
            <tr className="mt-2 mb-2">
              <td className="mt-20 mb-20 post-message border-0">{post.post}</td>
            </tr>
            <tr className="d-flex border-bottom border-top mb-2">
              <td className="w-100">
                <button
                  type="button"
                  className="btn btn-light rounded-0 float-left w-50"
                >
                  <i className="material-icons-outlined">comment</i>
                  {countComment[post.id]}
                </button>
                <button
                  type="button"
                  className="btn btn-light rounded-0 float-right w-50"
                  onClick={() => handleUpdateOrCreateLike(post)}
                >
                  {/* {post.likes.length > 0 && (
                    <React.Fragment>
                      {post.likes.map(item => (
                        <React.Fragment key={item.id}>
                          {item.like && item.creatorLikesId === user.id && (
                            <i className="material-icons">thumb_up</i>
                          )}
                          {!item.like && item.creatorLikesId === user.id && (
                            <i className="material-icons-outlined">thumb_up</i>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  )}
                  {post.likes.length === 0 && (
                    <i className="material-icons-outlined">thumb_up</i>
                  )} */}
                  {likes.map(item => (
                    <React.Fragment key={item.id}>
                      {item.postId === post.id &&
                        item.creatorLikesId === user.id &&
                        item.like === true && (
                          <i className="material-icons">thumb_up</i>
                        )}
                      {item.postId === post.id &&
                        item.creatorLikesId === user.id &&
                        item.like === false && (
                          <i className="material-icons-outlined">thumb_up</i>
                        )}
                    </React.Fragment>
                  ))}
                  {post.likes.length === 0 && (
                    <i className="material-icons-outlined">thumb_up</i>
                  )}
                  {countLikes[post.id]}
                </button>
              </td>
            </tr>
            {comments.map(comment => (
              <tr className="d-flex align-items-center" key={comment.id}>
                {comment.postId === post.id && (
                  <React.Fragment>
                    <td className="border-0 d-flex flex-column mb-2 align-self-start">
                      <Link
                        to={{
                          pathname: `/profile/${comment.creatorComment.username}`,
                          state: comment.creatorComment.username
                        }}
                        // to={`/profile/${comment.creatorComment.username}`}
                        // className="mr-2"
                      >
                        <img
                          className="comment-photo"
                          src={`https://i.picsum.photos/id/${comment.creatorComment.id}/300/300.jpg`}
                          alt="Profile"
                        />
                      </Link>
                    </td>
                    <td className="comment-message border-0 mb-2 pb-1 pt-1 pr-2 pl-2">
                      <Link
                        to={{
                          pathname: `/profile/${comment.creatorComment.username}`,
                          state: comment.creatorComment.username
                        }}
                      >
                        <strong>{comment.creatorComment.username}</strong>
                      </Link>{" "}
                      {comment.comment}
                    </td>
                    {comment.creatorComment.username === user.username && (
                      <td className="d-flex flex-column align-self-center pl-1">
                        <div>
                          <i
                            className="fa fa-ellipsis-h"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          ></i>
                          <div className="dropdown-menu dropdown-menu-right">
                            <li className="dropdown-item">Edit</li>
                            <li
                              className="dropdown-item"
                              onClick={() => handleDeleteComment(comment)}
                            >
                              Delete
                            </li>
                          </div>
                        </div>
                      </td>
                    )}
                  </React.Fragment>
                )}
              </tr>
            ))}

            <tr className="d-flex align-items-center">
              <td className="border-0 d-flex align-self-start">
                <Link
                  to={{
                    pathname: `/profile/${user.username}`,
                    state: user.username
                  }}
                >
                  <img
                    className="comment-photo"
                    src={`https://i.picsum.photos/id/${user.id}/300/300.jpg`}
                    alt="Profile"
                  />
                </Link>
              </td>
              <td className="w-100">
                <form>
                  <TextareaAutosize
                    type="text"
                    className="comment-message comment-form pr-2 pl-2 pt-1 pb-1 form-control"
                    id={`comment${post.id}`}
                    placeholder="Write Comment"
                    name={`comment${post.id}`}
                    autoComplete="off"
                    // maxRows={1}
                    // inputRef={tag => (this.textarea = tag)}
                    onKeyDown={e => handleCreateComment(e, post.id)}
                  />
                </form>
              </td>
            </tr>
          </tbody>
        ))
      ).reverse()}
    </table>
  );
};

export default ProfileFeed;

// Dibawa ini skrip post->comment
//             {post.comments.length > 0 &&
//               post.comments.map(comment => (
//                 <tr className="d-flex align-items-center mb-2" key={comment.id}>
//                   <td className="border-0 d-flex flex-column align-self-start">
//                     <Link
//                       to={`/profile/${comment.creatorComment.username}`}
//                       className="comment-photo mr-2"
//                     ></Link>
//                   </td>
//                   <td className="comment-message border-0 p-2">
//                     <Link to={`/profile/${comment.creatorComment.username}`}>
//                       <strong>{comment.creatorComment.username} </strong>
//                     </Link>
//                     {comment.comment}
//                   </td>
//                 </tr>
//               ))}
