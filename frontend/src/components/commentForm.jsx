import React, { Component } from "react";
import { Link } from "react-router-dom";

class CommentForm extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    return (
      <React.Fragment>
        <td className="border-0 d-flex flex-column align-self-start">
          <Link
            // to={`/profile/${comment.creatorComment.username}`}
            className="comment-photo mr-2"
          ></Link>
        </td>
        <td>
          <form
            onSubmit={this.props.handleCreateComment}
            // className="d-flex align-items-center"

            // onSubmit={this.handleSubmit}
            // onChange={this.handleChange}
          >
            <input
              type="text"
              className="comment-message comment-form pr-2 pl-2"
              id="text"
              placeholder="Write Comment"
              autoComplete="off"
              ref={React.forwardRef(this.props.createComment)}
            />
          </form>
        </td>
      </React.Fragment>
    );
  }
}

export default CommentForm;

// const CommentForm = ({ handleCreateComment, createComment }) => {
//   return (
//     <React.Fragment>
//       <td className="border-0 d-flex flex-column align-self-start">
//         <Link
//           // to={`/profile/${comment.creatorComment.username}`}
//           className="comment-photo mr-2"
//         ></Link>
//       </td>
//       <td>
//         <form
//           onSubmit={handleCreateComment}
//           // className="d-flex align-items-center"

//           // onSubmit={this.handleSubmit}
//           // onChange={this.handleChange}
//         >
//           <input
//             type="text"
//             className="comment-message comment-form pr-2 pl-2"
//             id="text"
//             placeholder="Write Comment"
//             autoComplete="off"
//             ref={createComment}
//           />
//         </form>
//       </td>
//     </React.Fragment>
//   );
// };

// export default CommentForm;
