import React, { Component } from 'react'
import './Spinner.css'
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";

const override = css`
  display: grid;
  margin: 0 auto;
  border-color: red;
`;

class Spinner extends Component {
    render() {
        return this.props.spin?(
            <div className='pageDiv' id='pageDiv'>
                <div className="dataDiv">
                    <BarLoader css={override} size={100} color={"#123abc"} height={30} width={300} loading={this.props.spin} />
                    <span className="spinnerMessage">Une minute... <br />{this.props.message}</span>
                </div>
            </div>
        ):null
    }
}

export default Spinner