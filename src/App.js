// hot reloading
import { hot } from "react-hot-loader/root";
import {
  Button,
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { sortData } from "./util/sort";
import Box from "./Components/Box/Box";
import Map from "./Components/Map/Map";
import Table from "./Components/Table/Table";
import LineGraph from "./Components/LineGraph/LineGraph";
import Icon from "@material-ui/core/Icon";
import "./app.css";
import { createMuiTheme } from "@material-ui/core/";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  // state hooks

  // country list { name: string, value: string }
  const [countries, setCountries] = useState([]);

  // current country
  const [country, setCountry] = useState("worldwide");

  // set information for currently selected country
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [caseType, setCaseType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 20.0, lng: 0.0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [date, setDate] = useState("today");

  // full information for all countries
  const [mapCountries, setMapCountries] = useState([]);

  // set total stats for the world
  const setWorldInfo = async () => {
    const response = await fetch("https://disease.sh/v3/covid-19/all");
    let data = await response.json();
    setCountryInfo(data);
  };

  // get data for all countries
  const getCountries = async () => {
    const response = await fetch("https://disease.sh/v3/covid-19/countries");
    let data = await response.json();

    // list of countries for dropdown
    const countries = await data.map((country) => ({
      name: country.country,
      value: country.countryInfo.iso2,
    }));

    // sort data for sidebar
    const sortedData = sortData(data);
    //console.log(sortedData);

    // set state variables
    setMapCountries(data);
    setTableData(sortedData);
    setCountries(countries);
  };

  // on case change
  const oncaseTypeChange = async (e) => {
    const caseType = e.target.value;
    setCaseType(caseType);
  };

  const onDateChange = async (e) => {
    const v = e.target.value;
    setDate(v);

    const day = date === "today" ? "" : date;

    const url =
      country === "worldwide"
        ? `https://disease.sh/v3/covid-19/all${day}`
        : `https://disease.sh/v3/covid-19/countries/${country}${day}`;

    // request
    const response = await fetch(url);
    const data = await response.json();

    setCountryInfo(data);

    // map zoom for leaflet. higher value for higher zoom out
    setMapZoom(4);
  };

  const updateTable = async () => {
    const day = date === "today" ? "" : date;

    const response = await fetch(
      `https://disease.sh/v3/covid-19/countries${day}`
    );
    const data = await response.json();

    const sortedData = sortData(data);
    setTableData(sortedData);
  };
  // on country change in dropdown menu set Country code and fetch data
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const day = date === "today" ? "" : date;
    const url =
      country === "worldwide"
        ? `https://disease.sh/v3/covid-19/all${day}`
        : `https://disease.sh/v3/covid-19/countries/${country}${day}`;

    // request
    const response = await fetch(url);
    const data = await response.json();

    setCountryInfo(data);
    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

    // map zoom for leaflet. higher value for higher zoom out
    setMapZoom(4);
  };

  // on mount fetch list of countries, and set table data
  useEffect(() => {
    setWorldInfo();
    getCountries();
  }, []);

  useEffect(() => {
    updateTable();
  }, [date]);

  return (
    <div className="app">
      <div className="app__main">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <div className="app__dropdown__container">
            <Card>
              <FormControl className="app__dropdown">
                <Select variant="outlined" onChange={onDateChange} value={date}>
                  <MenuItem key="today" value="today">
                    Today
                  </MenuItem>
                  <MenuItem key="yesterday" value="?yesterday=true">
                    Yesterday
                  </MenuItem>
                  <MenuItem key="twodays" value="?twoDaysAgo=true">
                    2 Days ago
                  </MenuItem>
                </Select>
              </FormControl>
            </Card>
            <Card>
              <FormControl className="app__dropdown">
                <Select
                  variant="outlined"
                  onChange={oncaseTypeChange}
                  value={caseType}
                >
                  <MenuItem key="cases" value="cases">
                    Cases
                  </MenuItem>
                  <MenuItem key="recovered" value="recovered">
                    Recovered
                  </MenuItem>
                  <MenuItem key="deaths" value="deaths">
                    Deaths
                  </MenuItem>
                </Select>
              </FormControl>
            </Card>
            <Card>
              <FormControl className="app__dropdown">
                <Select
                  variant="outlined"
                  onChange={onCountryChange}
                  value={country}
                >
                  <MenuItem key="world" value="worldwide">
                    Worldwide
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.name} value={country.value}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>
          </div>
        </div>

        <div className="app__stats">
          <Box
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />

          <Box
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />

          <Box
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map
          countries={mapCountries}
          caseType={caseType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__aside">
        <CardContent>
          <h2 className="app__aside__heading">Live Cases by Country</h2>
          <Table countries={tableData} day={date} />
          <h2 className="app__aside__heading">Worldwide new {caseType}</h2>
          <LineGraph caseType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
