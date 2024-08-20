import React from "react";
import { Input } from "@/components/ui/input";
import { useAutomationFlowStore } from "@/store/automationFlowStore";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import SelectBox from "@/components/Shared/SelectBox";

const EditPipelineStage = () => {
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

  const selectChangeHandler = (value, name) => {
    setSelectedNode({
      ...selectedNode,
      data: { ...selectedNode.data, [name]: value },
    });
  };

  return (
    <div>
      <div className="mb-4">
        <Label
          className={clsx(
            "text-[14px] leading-[22px] text-[#3E3F3F] font-medium mb-2 block"
          )}
        >
          Action Name *
        </Label>
        <Input
          className={clsx("focus-visible:ring-0 focus-visible:ring-offset-0")}
          type="text"
          name="label"
          value={selectedNode.data.label}
          onChange={onChangeHandler}
        />
      </div>

      <div className="mb-4">
        <SelectBox
          label={"Pipeline"}
          value={selectedNode.data.pipeline}
          onChange={(value) => selectChangeHandler(value, "pipeline")}
        >
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectBox>
      </div>
      <SelectBox
        label={"Stage"}
        value={selectedNode.data.stage}
        onChange={(value) => selectChangeHandler(value, "stage")}
      >
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectBox>
    </div>
  );
};

export default EditPipelineStage;
