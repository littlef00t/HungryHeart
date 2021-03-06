var React = require('react');
var DishStore = require('../stores/dish');
var CurrentUserStore = require('../stores/current_user');
var ApiUtil = require('../util/api_util');
var ReactRouter = require('react-router');
var CommentForm = require('./commentForm');
var CommentIndexItem = require('./CommentIndexItem');
var History = require('react-router').History;

var DishDetail = React.createClass({
  mixins: [History],

  getStateFromStore: function () {
    return { dish: DishStore.find(parseInt(this.props.params.dishId)),
              // current_user: CurrentUserStore.find()
     };
  },

  getInitialState: function () {
    return this.getStateFromStore();
  },

  _onChange: function () {
    this.setState(this.getStateFromStore());
  },

  componentWillReceiveProps: function (newProps) {
    ApiUtil.fetchDish(parseInt(newProps.params.dishId));
    this._onChange();
  },
  componentDidMount: function () {
    // this.currentuserListener = CurrentUserStore.addListener(this._onChange);
    // ApiUtil.fetchCurrentUser();
    this.dishListener = DishStore.addListener(this._onChange);
    ApiUtil.fetchDish(parseInt(this.props.params.dishId));
  },
  componentWillUnmount: function () {
    this.dishListener.remove();
    // this.currentuserListener.remove();
  },
  handleDelete: function (e) {
    e.preventDefault();
    ApiUtil.deleteDish(this.state.dish.id, function () {
      this.history.pushState(null, "dishes", {})
    }.bind(this));
  },
  render: function () {
    var Link = ReactRouter.Link;
    var dish = this.state.dish;
    var current_user = this.props.current_user;

    var commentForm;
    if (current_user.id !== -1) {
      commentForm = <CommentForm dish={dish}/>
    } else {
      commentForm = <div></div>
    }

    if (!this.state.dish) {
      return (<div>Loading...</div>)
    }

    var deleteButton;
    if ((current_user.id !== -1) && (current_user.id === this.state.dish.user_id)) {
      deleteButton = <div><input type="button" className="btn btn-minor" dish={dish} onClick={this.handleDelete} value="Delete Dish"/></div>

    } else {
      deleteButton = <div></div>
    }


    return (
      <div className="center-align padding-top">
        <div>
          {
            dish.images.map(function (image) {
              return (
                <img className="white-border" key={image.id} src={"https://res.cloudinary.com/littlef00t/image/upload/w_300,h_300/" + image.url + ".png"}/>
              )
            })
          }
          {deleteButton}
        </div>
        <h4>{dish.name}</h4>
          <h5>Pickup Location: {dish.location}</h5>
          <h5>Pickup Date and Time: {dish.pickup_time}</h5>
          <small className="purple-color">posted by {dish.username}</small>
        <br/>
        {commentForm}
        <br/>
        <p className="purple-color"><strong>LOVE NOTES</strong></p>
        <ul>
          {
            dish.comments.map(function (comment) {
              return (
                <div key={comment.id}>
                  <CommentIndexItem comment={comment} currentuser={current_user}/>
                  <p>----------------------------------------------</p>
                </div>
              )
            })
          }
        </ul>
        <Link to="/" > Back to Dishes Index </Link>
      </div>
    );
  }
});

module.exports = DishDetail;
