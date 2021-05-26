import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";
import "./box.css";

// destructure props into variables

// (props) props.title, props.cases, props.total etc
function Box({ title, cases, active, total, ...props }) {
  return (
    <Card
    onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"}`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className="infoBox__cases">{numeral(cases).format("+0,0")}</h2>

        <Typography className="infoBox__total" color="textSecondary">
          {numeral(total).format("0,0")} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Box;
