import React from "react";
import NodeComponent from "@/components/Nodes/NodeComponent";
import { Handle } from "@xyflow/react";

const DefaultNode = ({ id, type, data }) => (
  <div className="node__item" style={{ borderColor: "rgb(24, 144, 255)" }}>
    <Handle type="target" position="top" />
    <NodeComponent id={id} data={data} type={type} />

    <Handle type="source" position="bottom" />
  </div>
);

export default DefaultNode;
