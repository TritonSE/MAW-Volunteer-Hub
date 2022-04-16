import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import ROLES from "../constants/roles";

export default function RoleSelect({ value, setValue, hasError }) {
  const [hasAll, setHasAll] = useState();
  const [rolesAdj, setRolesAdj] = useState();

  useEffect(() => setHasAll(value?.length === ROLES.length), [value]);

  useEffect(
    () =>
      setRolesAdj([
        {
          value: "all",
          label: hasAll ? "Deselect All" : "Select All",
          all: true,

          background: "#cccccc",
          color: "black",
        },
        ...ROLES.map((role) => ({
          ...role,
          value: role.name,
          label: role.name,
        })),
      ]),
    [hasAll]
  );

  const styles = {
    container: (provided) => ({
      ...provided,
      flex: "1",
      marginLeft: "10px",
      maxWidth: "213px",
      maxHeight: "70px",
    }),
    control: (provided) => ({
      ...provided,
      border: hasError ? "1px solid red" : "1px solid black !important",
      maxHeight: "70px",
      overflow: "auto",
      position: "relative",
      cursor: "pointer",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      maxHeight: "70px",
    }),
    option: (provided, state) => {
      const opacity = state.isFocused ? "99" : "66";
      const has_bgd = (state.isFocused || state.isSelected) && !state.data.all;

      return {
        ...provided,
        background: has_bgd ? state.data.background + opacity : "white",
        color: state.data.color,

        cursor: state.data.all ? "pointer" : "",
        borderBottom: state.data.all ? "1px solid lightgray" : "",

        ":active": {
          background: state.data.background + "EE",
        },
      };
    },
    multiValue: (provided, state) => ({
      ...provided,
      background: `${state.data.background}99`,
      color: state.data.color,
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
  };

  return (
    <ReactSelect
      options={rolesAdj}
      isMulti
      allowSelectAll
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      placeholder="Send event to..."
      onChange={(newVal) => {
        if (newVal.includes(rolesAdj[0])) {
          if (hasAll) {
            setHasAll(false);
            setValue([]);
          } else {
            setHasAll(true);
            setValue(rolesAdj.slice(1));
          }
        } else {
          setHasAll(newVal.length === rolesAdj.length - 1);
          setValue(newVal);
        }
      }}
      value={value}
      styles={styles}
    />
  );
}
