"use client";

import React, { useState } from "react";
import { nodesIcon, nodeTypeOptions } from "@/constants";

const NodeComponent = ({ id, data, type }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div className="node__item">
      {nodesIcon[type]?.icon && (
        <span
          style={{ background: nodesIcon[type]?.bg }}
          className="w-[35px] h-[35px] flex items-center justify-center rounded"
        >
          {nodesIcon[type]?.icon}
        </span>
      )}
      <p className="text-[14px] leading-6 text-[#3E3F3F] font-medium">
        {data.label}
      </p>
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
          {nodeTypeOptions.map((node) => (
            <div
              key={node.id}
              onClick={() => {
                setDropdownVisible(false);
                data.onAddNode(id, node);
              }}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
              }}
            >
              {node.type}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeComponent;
