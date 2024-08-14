"use client";

import React from "react";
import { nodesIcon } from "@/constants";
import NodesSidebar from "@/components/Sidebar/NodesSidebar";
import NodeEditSidebar from "../Sidebar/NodeEditSidebar";

const NodeComponent = ({ id, data, type }) => {
  const AddButton = type && type !== "end" && (
    <button
      style={{
        position: "absolute",
        bottom: "0",
        right: "0",
        cursor: "pointer",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      +
    </button>
  );

  const NodeComponent = (
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

      <NodesSidebar
        trigger={AddButton}
        onAddNode={data.onAddNode}
        sourceNodeId={id}
      />
    </div>
  );

  return <NodeEditSidebar nodeId={id} data={data} trigger={NodeComponent} />;
};

export default NodeComponent;
