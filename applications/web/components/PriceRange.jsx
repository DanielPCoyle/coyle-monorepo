import PropTypes from 'prop-types';
import { useState } from "react";
import { Range } from "react-range";

const PriceRange = ({ min = 0, max = 1000, step = 1, onChange }) => {
  // Set initial state for min and max values of the range
  const [values, setValues] = useState([min, max]);

  // Handle the change in slider values
  const handleRangeChange = (values) => {
    setValues(values);
    if(typeof onChange === "function") {
      onChange(values); 
    } 
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={handleRangeChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "6px",
              width: "100%",
              backgroundColor: "#ddd",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "100%",
                width: `${((values[1] - values[0]) / (max - min)) * 100}%`,
                backgroundColor: "#548BF4",
                left: `${((values[0] - min) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              backgroundColor: "#548BF4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: "12px",
            }}
          >
            {values[index]}
          </div>
        )}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <span>Min: ${values[0]}</span>
        <span>Max: ${values[1]}</span>
      </div>
    </div>
  );
};

PriceRange.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func,
  style: PropTypes.object,
};

export default PriceRange;
