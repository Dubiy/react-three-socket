import React, {Component} from 'react'

export default class CounterComponent extends Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        console.log('componentDidMount() props in component', this.props)
    }


    render() {
        console.log('CounterComponent: render()')

        return (
            <div>
                <h3>Counter component</h3>
                {/*<input type='text' value={this.props.count} onChange={this.changeName} />*/}
                <button onClick={() =>this.props.incrementCount(1)}>+</button>
                {this.props.count}
                <button onClick={() => this.props.decrementCount()}>-</button>
            </div>

        )
    }
}