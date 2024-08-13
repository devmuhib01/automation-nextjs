import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import NodesList from "@/components/Sidebar/NodesList";

const NodesSidebar = ({ onAddNode, sourceNodeId, trigger }) => {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className={clsx("p-0 overflow-y-scroll")}>
        <SheetHeader className={clsx("px-5 py-3")}>
          <SheetTitle
            className={clsx(
              "text-[20px] leading-[30px] text-[#3E3F3F] font-semibold "
            )}
          >
            Actions
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
          <NodesList onAddNode={onAddNode} sourceNodeId={sourceNodeId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodesSidebar;
