import React from "react";
import NodeComponent from "@/components/Nodes/NodeComponent";
import { Handle } from "@xyflow/react";

const InputNode = ({ id, type, data }) => (
  <div className="node__item" style={{ borderColor: "rgb(82, 196, 26)" }}>
    {/* <Handle type="target" position="top" /> */}
    <NodeComponent id={id} data={data} type={type} />

    <Handle type="source" position="bottom" />
  </div>
);

export default InputNode;
