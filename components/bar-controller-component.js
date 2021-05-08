// const Slider = require('rc-slider');
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

    // changeLowerBound(e) {
    //     this.props.updateProps({
    //         upperBound: e.target.value
    //     })
    // }

    // changeUpperBound(e) {
    //     this.props.updateProps({
    //         upperBound: e.target.value
    //     })
    // }

    changeSearch(e) {
        this.props.updateProps({
            search: e.target.value
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
                {/* <label className="bar-controls-labels" htmlFor="lower-bound">Lower:</label>
                <input className="bar-controls" id="lower-bound" onChange={this.changeLowerBound.bind(this)} type="text"></input>
                <label className="bar-controls-labels" htmlFor="upper-bound">Upper:</label>
                <input className="bar-controls" id="upper-bound" onChange={this.changeUpperBound.bind(this)} type="text"></input> */}
                <label className="bar-controls-labels" htmlFor="search">Search:</label>
                <input className="bar-controls" id="search" onChange={this.changeSearch.bind(this)} type="text"></input>
            </div>
        );
    }
}

module.exports = BarControllerComponent;
