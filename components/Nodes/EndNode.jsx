import React from "react";
import NodeComponent from "@/components/Nodes/NodeComponent";
import { Handle } from "@xyflow/react";

const EndNode = ({ id, type, data }) => (
  <div className="node__output">
    <Handle type="target" position="top" />
    <NodeComponent id={id} data={data} type={type} />

    {/* <Handle type="source" position="bottom" /> */}
  </div>
);

export default EndNode;
