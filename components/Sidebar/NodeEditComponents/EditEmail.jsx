import React from "react";
import { Input } from "@/components/ui/input";
import { useAutomationFlowStore } from "@/store/automationFlowStore";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import SelectBox from "@/components/Shared/SelectBox";
import { Textarea } from "@/components/ui/textarea";

const EditEmail = () => {
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
    console.log(value);
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
          required={true}
        />
      </div>

      <SelectBox
        label={"From Email"}
        value={selectedNode.data.fromEmail}
        onChange={(value) => selectChangeHandler(value, "fromEmail")}
      >
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectBox>

      <div className="my-4">
        <Label
          className={clsx(
            "text-[14px] leading-[22px] text-[#3E3F3F] font-medium mb-2 block"
          )}
        >
          From Name *
        </Label>
        <Input
          className={clsx("focus-visible:ring-0 focus-visible:ring-offset-0")}
          type="text"
          name="fromName"
          value={selectedNode.data.fromName}
          onChange={onChangeHandler}
          placeholder="From Name"
          required={true}
        />
      </div>
      <div className="my-4">
        <Label
          className={clsx(
            "text-[14px] leading-[22px] text-[#3E3F3F] font-medium mb-2 block"
          )}
        >
          Subject Line *
        </Label>
        <Input
          className={clsx("focus-visible:ring-0 focus-visible:ring-offset-0")}
          type="text"
          name="subject"
          value={selectedNode.data.subject}
          onChange={onChangeHandler}
          placeholder="Write subject line"
          required={true}
        />
      </div>

      <SelectBox
        label={"Templates"}
        value={selectedNode.data.template}
        onChange={(value) => selectChangeHandler(value, "template")}
      >
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectBox>

      <div className="mt-4">
        <Label
          className={clsx(
            "text-[14px] leading-[22px] text-[#3E3F3F] font-medium mb-2 block"
          )}
        >
          Message
        </Label>
        <Textarea
          name="message"
          value={selectedNode.data.message}
          onChange={onChangeHandler}
          placeholder="Write message...."
          className={clsx("focus-visible:ring-0 focus-visible:ring-offset-0")}
        />
      </div>
    </div>
  );
};

export default EditEmail;
