import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./box.css";

// destructure props into variables

// (props) props.title, props.cases, props.total etc
function Box({ title, cases, active, isRed, total, ...props }) {
  return (
    <Card
    onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className="infoBox__cases">{cases}</h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Box;
