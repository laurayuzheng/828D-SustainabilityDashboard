const React = require('react');

class BarControllerComponent extends React.Component {

    changeUnits(e) {
        this.props.updateProps({
            unit: e.target.value
        })
    }

    changeSortBy(e) {
        this.props.updateProps({
            sortby: e.target.value
        })
    }

    changeOrderBy(e) {
        this.props.updateProps({
            orderby: e.target.value
        })
    }

    render() {
        return (
            <div className="controls">
                <label className="bar-controls-labels" htmlFor="units">Units:</label>
                <select className="bar-controls" id="units" onChange={this.changeUnits.bind(this)}  value={this.props.unit}>
                    <option value="lbs">Pounds (lbs)</option>
                    <option value="kgs">Kilograms (kgs)</option>
                </select>
                <label className="bar-controls-labels" htmlFor="sortby">Sort By:</label>
                <select className="bar-controls" id="sortby" onChange={this.changeSortBy.bind(this)} value={this.props.sortby}>
                    <option value="count">Count</option>
                    <option value="food">Food Name</option>
                </select>
                <label className="bar-controls-labels" htmlFor="orderby">Order By:</label>
                <select className="bar-controls" id="orderby" onChange={this.changeOrderBy.bind(this)} value={this.props.orderby}>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </select>
            </div>
        );
    }
}

module.exports = BarControllerComponent;
