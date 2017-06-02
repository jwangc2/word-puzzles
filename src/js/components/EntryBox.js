var Panel = require("react-bootstrap/lib/Panel");
var Grid = require("react-bootstrap/lib/Grid");
var Row = require("react-bootstrap/lib/Row");
var Col = require("react-bootstrap/lib/Col");
var ListGroup = require("react-bootstrap/lib/ListGroup");
var ListGroupItem = require("react-bootstrap/lib/ListGroupItem");
var Button = require("react-bootstrap/lib/Button");
var FormGroup = require("react-bootstrap/lib/FormGroup");
var FormControl = require("react-bootstrap/lib/FormControl");

var EntryBox = React.createClass({
    getInitialState: function() {
        return {entry: {"key": "Loading...", "Loading...": []}, prev: -1, offsetText: "0", next: 1, answerVisible: false};
    },
    getCurrEntry: function() {
        this.getEntry(this.state.offsetText);
    },
    getPrevEntry: function() {
        this.getEntry(this.state.prev);
    },
    getNextEntry: function() {
        this.getEntry(this.state.next);
    },
    getEntry: function(offset) {
        var query = "?offset=" + offset;
        $.ajax({
            url: this.props.splitUrl + query,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.state.entry = data["entry"]
                this.state.prev = data["prev"]
                this.state.next = data["next"]
                this.setState({entry: this.state.entry, prev: this.state.prev, next: this.state.next, offsetText: offset.toString()});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                // todo: prompt user to refresh?
            }.bind(this)
        });
    },
    transitionPrev: function(evt) {
        this.hideAnswer();
        this.getPrevEntry();
    },
    transitionNext: function(evt) {
        this.hideAnswer();
        this.getNextEntry();
    },
    hideAnswer: function() {
        this.setState({answerVisible: false});
    },
    toggleAnswer: function() {
        this.setState({answerVisible: !this.state.answerVisible});
    },
    componentDidMount: function() {
        this.getCurrEntry();   
    },
    handleSubmit: function(e) {
        e.preventDefault();
        this.getCurrEntry();
    },
    handleOffsetTextChange: function(e) {
        this.setState({offsetText: e.target.value});
    },
    render: function() {
        var key = this.state.entry["key"];
        var eNodes = this.state.entry[key].map(function(answer) {
            return (
                <ListGroupItem>{answer}</ListGroupItem>
            );
        });
        
        return (
            <Grid fluid={true}>
                <Row>
                    <Col sm={12} mdOffset={3} md={6}>
                        <h2 style={{"textAlign": "center"}}>Split the Difference!</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={5} mdOffset={3} md={2}>
                        <Button block onClick={this.transitionPrev} href="#">&larr;</Button>
                    </Col>
                    <Col sm={2} md={2}>
                        <form className="offsetForm" onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    componentClass="input"
                                    type="text"
                                    placeholder="Press [Enter] to submit."
                                    value={this.state.offsetText}
                                    onChange={this.handleOffsetTextChange}
                                />
                            </FormGroup>
                        </form>
                    </Col>
                    <Col sm={5} md={2}>
                        <Button block onClick={this.transitionNext} href="#">&rarr;</Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} mdOffset={3} md={6}>
                        <a href="#" onClick={this.toggleAnswer} className="togglePanel">
                            <Panel
                                collapsible
                                expanded={this.state.answerVisible}
                                onSelect={this.toggleAnswer}
                                header={this.state.entry["key"]}
                                className="entryBox"
                                >
                                <ListGroup fill>
                                {eNodes}
                                </ListGroup>
                            </Panel>
                        </a>
                    </Col>
                </Row>
            </Grid>
        )
    }
});

module.exports = EntryBox;