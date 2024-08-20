import React from "react";
import { Input } from "@/components/ui/input";
import { useAutomationFlowStore } from "@/store/automationFlowStore";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import SelectBox from "@/components/Shared/SelectBox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const EditUpdateContact = () => {
  const { setSelectedNode, selectedNode } = useAutomationFlowStore((state) => ({
    setSelectedNode: state.setSelectedNode,
    selectedNode: state.selectedNode,
  }));

  const onChangeHandler = (event, index = null) => {
    if (selectedNode) {
      if (index !== null) {
        // Update a specific field in the fields array
        const updatedFields = selectedNode.data.fields.map((field, i) =>
          i === index
            ? { ...field, [event.target.name]: event.target.value }
            : field
        );
        setSelectedNode({
          ...selectedNode,
          data: { ...selectedNode.data, fields: updatedFields },
        });
      } else {
        // Update general data
        setSelectedNode({
          ...selectedNode,
          data: {
            ...selectedNode.data,
            [event.target.name]: event.target.value,
          },
        });
      }
    }
  };

  const selectChangeHandler = (value, index = null) => {
    if (index !== null) {
      // Update a specific field's name in the fields array
      const updatedFields = selectedNode.data.fields.map((field, i) =>
        i === index ? { ...field, name: value } : field
      );
      setSelectedNode({
        ...selectedNode,
        data: { ...selectedNode.data, fields: updatedFields },
      });
    } else {
      // Update general tags or other data if needed
      setSelectedNode({
        ...selectedNode,
        data: { ...selectedNode.data, actionType: value },
      });
    }
  };

  const addField = (newField) => {
    if (selectedNode) {
      setSelectedNode({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          fields: [...selectedNode.data.fields, newField],
        },
      });
    }
  };

  const deleteField = (index) => {
    if (selectedNode) {
      const updatedFields = [...selectedNode.data.fields];
      updatedFields.splice(index, 1);
      setSelectedNode({
        ...selectedNode,
        data: { ...selectedNode.data, fields: updatedFields },
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

      <SelectBox
        label={"Action Type"}
        value={selectedNode.data.actionType}
        onChange={selectChangeHandler}
      >
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectBox>

      <div className="mt-4">
        <p
          className={
            "text-[14px] leading-[22px] text-[#3E3F3F] font-medium mb-2 block"
          }
        >
          Fields
        </p>

        <ul>
          {selectedNode.data.fields.map((field, index) => (
            <li key={index} className="grid grid-cols-12 gap-3 mb-3">
              <div className="col-span-5">
                <SelectBox
                  value={field.name}
                  onChange={(value) => selectChangeHandler(value, index)}
                >
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectBox>
              </div>
              <Input
                className={clsx(
                  "focus-visible:ring-0 focus-visible:ring-offset-0 col-span-6"
                )}
                type="text"
                name="value"
                value={field.value}
                onChange={(event) => onChangeHandler(event, index)}
              />

              <Button
                onClick={() => deleteField(index)}
                className={"bg-transparent hover:bg-transparent col-span-1 p-0"}
              >
                <Trash2 color="#616161" size={20} strokeWidth={1.5} />
              </Button>
            </li>
          ))}
        </ul>

        <Button
          className={clsx(
            "bg-transparent p-0 text-[#2F9089] hover:bg-transparent text-sm font-semibold mt-2.5"
          )}
          onClick={() => addField({ name: "city", value: "Sylhet" })}
        >
          <Plus size={18} color="#2F9089" className="mr-2" /> Add Field
        </Button>
      </div>
    </div>
  );
};

export default EditUpdateContact;
