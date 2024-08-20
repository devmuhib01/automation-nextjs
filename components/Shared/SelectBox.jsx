import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import clsx from "clsx";

const SelectBox = ({ value, onChange, label, children }) => {
  const selectHandler = (selectedValue) => {
    onChange(selectedValue);
  };

  return (
    <div>
      {label && (
        <Label
          className={clsx(
            "text-[14px] leading-[22px] text-[#3E3F3F] font-medium mb-2 block"
          )}
        >
          {label}
        </Label>
      )}
      <Select onValueChange={selectHandler} value={value}>
        <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select a list">
            {value ? value : "Select a list"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
};

export default SelectBox;
