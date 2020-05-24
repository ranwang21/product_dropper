class MultipleChoice extends Component {
    constructor (props) {
        super(props)
        this.state = { inputs: ['input-0'] }
    }

    render () {
        return (
            <div>
                <Form>
                    <div id='dynamicInput'>
                        {this.state.inputs.map(input => <FormInput key={input} />)}
                    </div>
                </Form>
                <button onClick={() => this.appendInput()}>
                    CLICK ME TO ADD AN INPUT
                </button>
            </div>
        )
    }

    appendInput () {
        var newInput = `input-${this.state.inputs.length}`
        this.setState(prevState => ({ inputs: prevState.inputs.concat([newInput]) }))
    }
}
