import React, { Component } from "react";
import Networks from "./dropdowns/Networks";

class CreateInstance extends Component {
  render() {
    return (
      <div>
        <h2>Launch Instance</h2>
        <Networks />
      </div>
    );
  }
}

export default CreateInstance;
