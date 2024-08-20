import React from "react";
import { Input } from "@/components/ui/input";
import { useAutomationFlowStore } from "@/store/automationFlowStore";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EditAddNote = () => {
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

      <div>
        <Label
          className={clsx(
            "text-[14px] leading-[22px] text-[#3E3F3F] font-medium mb-2 block"
          )}
        >
          Notes
        </Label>
        <Textarea
          name="note"
          value={selectedNode.data.note}
          onChange={onChangeHandler}
          placeholder="Write here...."
          className={clsx("focus-visible:ring-0 focus-visible:ring-offset-0")}
        />
      </div>
    </div>
  );
};

export default EditAddNote;
