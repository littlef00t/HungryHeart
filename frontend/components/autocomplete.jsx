var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var DishIndexItem = require('./DishIndexItem');


var AutoComplete = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function () {
    return { inputVal: "" };
  },

  matches: function () {
    var matches = [];
    var dishNames = this.props.dishes.map(function (dish) {
      return dish.name
    })
    if (this.state.inputVal.length === 0) {
      return dishNames;
    }
    dishNames.forEach(function (dish) {
      var sub = dish.slice(0, this.state.inputVal.length);
      if(sub.toLowerCase() === this.state.inputVal.toLowerCase()){
        matches.push(dish);
      }
    }.bind(this));
    if (matches.length === 0) {
      matches.push("No matches");
    }

    return matches;
  },

  fullDishes: function () {
    var matching = this.matches();
    var fullDishes = [];
    this.props.dishes.forEach(function (dish) {
      matching.forEach(function (match) {
        if (dish.name === match) {
          fullDishes.push(dish)
        }
      })
    })
    return fullDishes;
  },
  //This will be fine tuned
  // handleClick: function (e) {
  //   e.preventDefault();
  //   var dish = e.currentTarget.innerText;
  //   this.setState({ inputVal: dish })
  // },
  render: function () {
    var fullDishes = this.fullDishes();
    var that = this;
    var matchingDishes;
    if (fullDishes.length === 0) {
      matchingDishes = <div>Sorry, no matches</div>
    } else {
      matchingDishes = (
        <ul className="matched-items">
          {
            fullDishes.map(function (dish, idx) {
              return (
                <li key={idx}>
                  <DishIndexItem dish={dish}/>
                </li>
              )
            })
          }
        </ul>
      )
    }

    return (
      <div className="padding-bottom padding-sides">
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">search</i>
            <input id='dish-searched' type="text" valueLink={this.linkState('inputVal')} />
            <label className="active" htmlFor="dish-searched">Search for a dish</label>
          </div>
        </div>
        {matchingDishes}
      </div>
    )
  }
})

module.exports = AutoComplete;
