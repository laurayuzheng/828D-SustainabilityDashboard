const React = require('react');

class BarCarbonControllerComponent extends React.Component {

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

    changeLowerBound(e) {
        this.props.updateProps({
            lowerBound: e.target.value
        })
    }

    changeUpperBound(e) {
        this.props.updateProps({
            upperBound: e.target.value
        })
    }

    changeSearch(e) {
        this.props.updateProps({
            search: e.target.value
        })
    }

    render() {
        return (
            <div>
                <div className="controls-bar-wrapper">
                    <label className="bar-controls-labels" htmlFor="sortbyCarbon">Sort By:</label>
                    <select className="bar-controls" id="sortbyCarbon" onChange={this.changeSortBy.bind(this)} value={this.props.sortby}>
                        <option value="count">Total CO2 Emissions</option>
                        <option value="food">Food Name</option>
                    </select>
                    <label className="bar-controls-labels" htmlFor="orderbyCarbon">Order By:</label>
                    <select className="bar-controls" id="orderbyCarbon" onChange={this.changeOrderBy.bind(this)} value={this.props.orderby}>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>
                </div>
                <div className="controls-bar-wrapper">
                    <label className="bar-controls-labels" htmlFor="lower-boundCarbon">Lower:</label>
                    <input className="bar-controls-bounds" id="lower-boundCarbon" onChange={this.changeLowerBound.bind(this)} type="text" value={this.props.lowerBound}></input>
                    <label className="bar-controls-labels" htmlFor="upper-boundCarbon">Upper:</label>
                    <input className="bar-controls-bounds" id="upper-boundCarbon" onChange={this.changeUpperBound.bind(this)} type="text" value={this.props.upperBound}></input>
                    <label className="bar-controls-labels" htmlFor="searchCarbon">Search:</label>
                    <input className="bar-controls" id="searchCarbon" onChange={this.changeSearch.bind(this)} value={this.props.search} type="text"></input>
                </div>
            </div>
        );
    }
}

module.exports = BarCarbonControllerComponent;
