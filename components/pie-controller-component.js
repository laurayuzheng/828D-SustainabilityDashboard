// const Slider = require('rc-slider');
const React = require('react');

class PieControllerComponent extends React.Component {

    changeAttribute(e) {
        this.props.updateProps({
            attribute: e.target.value
        })
    }

    render() {
        return (
            <div className="controls">
                <label className="bar-controls-labels" htmlFor="attribute">Attribute:</label>
                <select className="bar-controls" id="attribute" onChange={this.changeAttribute.bind(this)}  value={this.props.attribute}>
                    <option value="gender">Gender</option>
                    <option value="major">Major</option>
                    <option value="degree">Degree</option>
                    <option value="dining">Dining Plan</option>
                </select>
            </div>
        );
    }
}

module.exports = PieControllerComponent;
