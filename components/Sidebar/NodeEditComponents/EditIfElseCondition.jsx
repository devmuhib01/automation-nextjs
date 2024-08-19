import React from "react";
import { Input } from "@/components/ui/input";
import { useAutomationFlowStore } from "@/store/automationFlowStore";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EllipsisVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EditIfElseCondition = () => {
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

  const onChildChangeHandler = (event, childId) => {
    if (selectedNode) {
      const updatedChildren = selectedNode.children.map((child) => {
        if (child.id === childId) {
          return {
            ...child,
            data: {
              ...child.data,
              [event.target.name]: event.target.value,
            },
          };
        }
        return child;
      });

      setSelectedNode({
        ...selectedNode,
        children: updatedChildren,
      });
    }
  };

  const onDeleteChildCondition = (event, childId) => {
    event.stopPropagation();
    if (selectedNode && selectedNode.children) {
      selectedNode.data.onDeleteNode(childId);

      // Find the index of the child with the given childId
      const childIndex = selectedNode.children.findIndex(
        (child) => child.id === childId
      );

      // If the child was found, remove it from the children array
      if (childIndex !== -1) {
        selectedNode.children.splice(childIndex, 1);
      }

      setSelectedNode(selectedNode);
    }
  };

  return (
    <div>
      <div>
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

      <div className="mt-4">
        <p className="text-[14px] leading-[22px] text-[#212524] font-semibold mb-3">
          Conditions
        </p>

        <Accordion type="single" collapsible>
          {selectedNode.children.map((child, index) => (
            <AccordionItem
              value={`item-${index + 1}`}
              key={child.id}
              className={clsx("border mb-3")}
            >
              <div className="bg-[#F2F5F5] p-3 flex items-center gap-4">
                <Input
                  className={clsx(
                    "focus-visible:ring-0 focus-visible:ring-offset-0"
                  )}
                  type="text"
                  name="label"
                  value={child.data.label}
                  onChange={(event) => onChildChangeHandler(event, child.id)}
                />

                <Popover>
                  <PopoverTrigger>
                    <EllipsisVertical
                      size={20}
                      color="#616161"
                      className="cursor-pointer"
                    />
                  </PopoverTrigger>
                  <PopoverContent className={clsx("w-[150px]")}>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        onDeleteChildCondition(e, child.id);
                      }}
                    >
                      Delete
                    </Button>
                  </PopoverContent>
                </Popover>

                <AccordionTrigger></AccordionTrigger>
              </div>

              <AccordionContent className={clsx("p-3")}>
                Yes. It adheres to the WAI-ARIA design pattern.
                {selectedNode.children.length}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button
          className={clsx(
            "bg-transparent p-0 text-[#2F9089] hover:bg-transparent text-sm font-semibold mt-2.5"
          )}
          onClick={() =>
            selectedNode.data.onAddNode(selectedNode.id, selectedNode.type, {
              type: "condition",
              data: {
                label: "New condition",
              },
              position: { x: 0, y: 0 },
            })
          }
        >
          <Plus size={18} color="#2F9089" className="mr-2" /> Add Condition
        </Button>
      </div>
    </div>
  );
};

export default EditIfElseCondition;
