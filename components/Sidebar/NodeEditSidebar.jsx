"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import EditAddToList from "@/components/Sidebar/NodeEditOptions/EditAddToList";
import { useAutomationFlowStore } from "@/store/automationFlowStore";

const NodeEditSidebar = ({ trigger }) => {
  const { selectedNode } = useAutomationFlowStore((state) => ({
    selectedNode: state.selectedNode,
  }));

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {selectedNode && (
        <SheetContent
          className={clsx("p-0 overflow-y-scroll")}
          onClick={(e) => e.stopPropagation()}
        >
          <SheetHeader className={clsx("px-5 py-3")}>
            <SheetTitle
              className={clsx(
                "text-[20px] leading-[30px] text-[#3E3F3F] font-semibold "
              )}
            >
              {selectedNode.data.label}
            </SheetTitle>
            <SheetDescription
              className={clsx(
                "text-[14px] leading-[22px] font-normal text-[#5F6161] "
              )}
            >
              Pick an action for this step
            </SheetDescription>
          </SheetHeader>
          <div className="px-5 py-4 border-t ">
            <EditAddToList />

            {selectedNode.type === "ifElse" && (
              <Button
                onClick={() =>
                  selectedNode.data.onAddNode(
                    selectedNode.id,
                    selectedNode.type,
                    {
                      type: "condition",
                      data: {
                        label: "New condition",
                      },
                      position: { x: 0, y: 0 },
                    }
                  )
                }
              >
                add branch
              </Button>
            )}
          </div>

          <SheetFooter className={clsx("p-5 border-t justify-start space-x-0")}>
            <div className="flex items-center justify-between w-full">
              {selectedNode.type !== "input" && (
                <Button
                  type="button"
                  variant="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectedNode.data.onDeleteNode(selectedNode.id);
                  }}
                >
                  Delete
                </Button>
              )}

              <div className="flex items-center gap-3">
                <SheetClose asChild>
                  <Button type="button" variant="cancel">
                    Cancel
                  </Button>
                </SheetClose>

                <Button type="submit" variant="save">
                  Save Action
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default NodeEditSidebar;
