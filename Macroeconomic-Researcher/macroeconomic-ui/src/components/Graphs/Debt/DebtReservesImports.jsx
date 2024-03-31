import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Chart } from 'react-google-charts';

const DebtReservesImports = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('World');
  const [chartData, setChartData] = useState([["Year", "Total Reserves"]]);

  useEffect(() => {
    const csvFileUrl = "./API_FI.RES.TOTL.MO_DS2_en_csv_v2_62321/API_FI.RES.TOTL.MO_DS2_en_csv_v2_62321.csv";

    Papa.parse(csvFileUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        const countriesFromCSV = results.data.map(row => row['Country Name']).filter((value, index, self) => self.indexOf(value) === index);
        setCountries(countriesFromCSV);
      },
    });
  }, []);

  useEffect(() => {
    if (selectedCountry !== 'World') {
      const csvFileUrl = "./API_FI.RES.TOTL.MO_DS2_en_csv_v2_62321/API_FI.RES.TOTL.MO_DS2_en_csv_v2_62321.csv";
      
      Papa.parse(csvFileUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const rows = results.data.filter(row => row['Country Name'] === selectedCountry);
          const reservesData = rows.map(row => {
            const filteredRow = Object.entries(row).filter(([key, value]) => !isNaN(Date.parse(key)) && value);
            return filteredRow.map(([key, value]) => [new Date(key), parseFloat(value)]);
          }).flat();
          setChartData([
            ["Year", "Total Reserves"],
            ...reservesData
          ]);
        },
      });
    }
  }, [selectedCountry]);

  // Handle country selection change
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      <label htmlFor="country-select">Country:</label>
      <select id="country-select" value={selectedCountry} onChange={handleCountryChange}>
        <option value="World">World</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>
      {selectedCountry !== 'World' && (
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            title: `Total Reserves in Months of Imports for ${selectedCountry}`,
            hAxis: { title: 'Year' },
            vAxis: { title: 'Total Reserves' },
          }}
        />
      )}
    </div>
  );
};

export default DebtReservesImports;
