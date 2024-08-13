"use client";

import React, { useState } from "react";
import { nodeTypeOptions } from "@/constants";

const NodeComponent = ({ id, data, type }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div>
      <p>{data.label}</p>
      <button
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          data.onDeleteNode(id);
        }}
      >
        x
      </button>
      {type && type !== "output" && (
        <button
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setDropdownVisible(!dropdownVisible);
          }}
        >
          +
        </button>
      )}
      {dropdownVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "0",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 10,
          }}
        >
          {nodeTypeOptions.map((type) => (
            <div
              key={type}
              onClick={() => {
                setDropdownVisible(false);
                data.onAddNode(id, type);
              }}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
              }}
            >
              {type}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeComponent;
