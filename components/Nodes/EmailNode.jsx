import React from "react";
import NodeComponent from "@/components/Nodes/NodeComponent";
import { Handle } from "@xyflow/react";

const EmailNode = ({ id, type, data }) => (
  <>
    <Handle type="target" position="top" />
    <NodeComponent id={id} data={data} type={type} />

    <Handle type="source" position="bottom" />
  </>
);

export default EmailNode;
