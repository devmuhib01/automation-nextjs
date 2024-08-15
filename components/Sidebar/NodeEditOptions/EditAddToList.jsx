import React from "react";
import { Input } from "@/components/ui/input";
import { useAutomationFlowStore } from "@/store/automationFlowStore";
import clsx from "clsx";

const EditAddToList = () => {
  const { setSelectedNode, selectedNode } = useAutomationFlowStore((state) => ({
    setSelectedNode: state.setSelectedNode,
    selectedNode: state.selectedNode,
  }));

  const onChangeHandler = (event) => {
    if (selectedNode) {
      setSelectedNode({
        ...selectedNode,
        data: { ...selectedNode.data, [event.target.name]: event.target.value },
      });
    }
  };

  return (
    <div>
      <Input
        className={clsx("focus-visible:ring-0 focus-visible:ring-offset-0")}
        type="text"
        name="label"
        value={selectedNode.data.label}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default EditAddToList;
