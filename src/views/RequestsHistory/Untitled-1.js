import React from "react";
/*
 * A simple React component
 */
class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "Created a web app for Mr. Locomotive",
      hours: "15",
      rate: "90",
      amount: "$1350",
    };
  }

  render() {
    return (
      <div className="invoice-body">
        <div className="d-flex flex-sm-row flex-column justify-content-center">
          <div className="invoice-itemization container-fluid">
            <table className="table table-bordered">
              <thead className="thead-default">
                <tr>
                  <th colspan="2">Description</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>{this.renderCells()}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  renderCells() {
    return ["description", "hours", "rate", "amount"].map((field) => (
      <Cell
        key={field}
        value={this.state[field]}
        onChange={(value) => this.setState({ [field]: value })}
      />
    ));
  }

  componentDidUpdate() {
    const { description, hours, rate, amount } = this.state;
    console.log(`New State: ${description} - ${hours} - ${rate} - ${amount}`);
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
  }

  render() {
    const { value, onChange } = this.props;

    return this.state.editing ? (
      <td className="no-pad">
        <input
          className="form-control editor edit-text"
          ref="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => this.onBlur()}
        />
      </td>
    ) : (
      <td onClick={() => this.onFocus()}>{value}</td>
    );
  }

  onFocus() {
    this.setState({ editing: true }, () => this.refs.input.focus());
  }

  onBlur() {
    this.setState({ editing: false });
  }
}
/*
 * Render the above component into the div#app
 */
React.render(<Application />, document.getElementById("app"));
