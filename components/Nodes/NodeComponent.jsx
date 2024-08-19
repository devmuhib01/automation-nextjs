"use client";

import React from "react";
import { nodesIcon } from "@/constants";

import NodeEditSidebar from "../Sidebar/NodeEditSidebar";

const NodeComponent = ({ id, data, type }) => {
  const NodeComponent = type !== "condition" && (
    <div className="node__item nodrag">
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
    </div>
  );

  const NonClickableNode = () => (
    <div className="node__item nodrag">
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
    </div>
  );

  return type === "condition" ? (
    <NonClickableNode />
  ) : (
    <NodeEditSidebar trigger={NodeComponent} />
  );
};

export default NodeComponent;
