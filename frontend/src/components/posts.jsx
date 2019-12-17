import React, { Component } from "react";

class Posts extends Component {
  // state = {};
  handlePost = () => {
    console.log("Posting");
  };

  render() {
    return (
      <div className="container">
        <form>
          <div className="form-group row">
            <label forhtml="exampleFormControlTextarea1">Buat Postingan</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </div>
          <div className="row">
            <button
              type="submit"
              className="btn btn-lg btn-block btn-outline-success"
              onClick={this.handlePost}
            >
              <i className="fa fa-paper-plane-o"> </i>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Posts;
