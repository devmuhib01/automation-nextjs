"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "../ui/input";

const NodeEditSidebar = ({ nodeId, nodeType, data, trigger }) => {
  const [formData, setFormData] = useState({
    label: "",
  });

  const onChangeHandler = (event) => {
    // Update the node's data with the new label

    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log(event.target.value);
  };

  useEffect(() => {
    setFormData({ label: data.label });
  }, []);

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
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
            {data.label}
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
          {nodeId} - {data.label}
          <Input
            className={clsx("focus-visible:ring-0 focus-visible:ring-offset-0")}
            type="text"
            name="label"
            value={formData.label}
            onChange={onChangeHandler}
          />
        </div>

        <SheetFooter className={clsx("p-5 border-t justify-start space-x-0")}>
          <div className="flex items-center justify-between w-full">
            {nodeType !== "input" && (
              <Button
                type="button"
                variant="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onDeleteNode(nodeId);
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
    </Sheet>
  );
};

export default NodeEditSidebar;
