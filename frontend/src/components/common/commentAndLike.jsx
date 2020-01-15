import React from "react";

const CommentAndLike = async (
  user,
  post,
  likes,
  comments,
  countComment,
  countLikes,
  handleUpdateOrCreateLike
) => {
  return await (
    <React.Fragment>
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
          {(post.likes.length === 0 || !likes) && (
            <i className="material-icons-outlined">thumb_up</i>
          )}
          {countLikes[post.id]}
        </button>
      </td>
    </React.Fragment>
  );
};

export default CommentAndLike;
