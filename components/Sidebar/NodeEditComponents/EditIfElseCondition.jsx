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
          <AccordionItem value="item-1" className={clsx("border")}>
            <div className="bg-[#F2F5F5] p-3 flex items-center gap-4">
              <Input
                className={clsx(
                  "focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
                type="text"
                name="label"
                value={selectedNode.data.label}
                onChange={onChangeHandler}
              />
              <EllipsisVertical
                size={20}
                color="#616161"
                className="cursor-pointer"
              />
              <AccordionTrigger></AccordionTrigger>
            </div>

            <AccordionContent className={clsx("p-3")}>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
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
