"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import clsx from "clsx";
import { nodesIcon, nodeTypeOptions } from "@/constants";

const NodesList = ({ onAddNode, sourceNodeId }) => {
  const [filterNodes, setFilterNodes] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);

  const searchHandler = (event) => {
    const filteredNodes = nodeTypeOptions.filter((node) =>
      node.data.label.toLowerCase().includes(event.target.value.toLowerCase())
    );

    if (event.target.value) {
      setFilterNodes(filteredNodes);

      if (!filteredNodes.length) {
        setIsNotFound(true);
      }
    } else {
      setFilterNodes([]);
      setIsNotFound(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 px-3 py-[7px] border rounded-md ">
        <Search size={16} color="#5F6161" />
        <Input
          type="text"
          onChange={searchHandler}
          placeholder="Search action"
          className={clsx(
            "p-0 border-none h-auto text-[14px] leading-[22px] font-normal placeholder:text-[#82808E] placeholder:font-normal focus-visible:ring-0 ocus-visible:ring-offset-0 rounded-none"
          )}
        />
      </div>

      {filterNodes.length > 0 && (
        <ul className="flex flex-col gap-3 mt-4">
          {filterNodes.map((node, index) => (
            <li
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onAddNode(sourceNodeId, node);
              }}
              className="p-2 rounded-lg border flex items-center gap-3.5 cursor-pointer"
            >
              <span
                style={{ background: nodesIcon[node.type].bg }}
                className="w-[35px] h-[35px] flex items-center justify-center rounded"
              >
                {nodesIcon[node.type].icon}
              </span>
              <p className="text-[14px] leading-6 text-[#3E3F3F] font-medium">
                {node.data.label}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!filterNodes.length && !isNotFound && (
        <div>
          <div>
            <p className="text-[14px] leading-[22px] font-bold text-[#3E3F3F] uppercase my-4">
              Contact
            </p>
            <ul className="flex flex-col gap-3">
              {nodeTypeOptions
                .filter((node) => node.group === "contact")
                .map((node, index) => (
                  <li
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNode(sourceNodeId, node);
                    }}
                    className="p-2 rounded-lg border flex items-center gap-3.5 cursor-pointer"
                  >
                    <span
                      style={{ background: nodesIcon[node.type].bg }}
                      className="w-[35px] h-[35px] flex items-center justify-center rounded"
                    >
                      {nodesIcon[node.type].icon}
                    </span>
                    <p className="text-[14px] leading-6 text-[#3E3F3F] font-medium">
                      {node.data.label}
                    </p>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="text-[14px] leading-[22px] font-bold text-[#3E3F3F] uppercase my-4">
              Pipeline
            </p>
            <ul className="flex flex-col gap-3">
              {nodeTypeOptions
                .filter((node) => node.group === "pipeline")
                .map((node, index) => (
                  <li
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNode(sourceNodeId, node);
                    }}
                    className="p-2 rounded-lg border flex items-center gap-3.5 cursor-pointer"
                  >
                    <span
                      style={{ background: nodesIcon[node.type].bg }}
                      className="w-[35px] h-[35px] flex items-center justify-center rounded"
                    >
                      {nodesIcon[node.type].icon}
                    </span>
                    <p className="text-[14px] leading-6 text-[#3E3F3F] font-medium">
                      {node.data.label}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <p className="text-[14px] leading-[22px] font-bold text-[#3E3F3F] uppercase my-4">
              Email
            </p>
            <ul className="flex flex-col gap-3">
              {nodeTypeOptions
                .filter((node) => node.group === "email")
                .map((node, index) => (
                  <li
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNode(sourceNodeId, node);
                    }}
                    className="p-2 rounded-lg border flex items-center gap-3.5 cursor-pointer"
                  >
                    <span
                      style={{ background: nodesIcon[node.type].bg }}
                      className="w-[35px] h-[35px] flex items-center justify-center rounded"
                    >
                      {nodesIcon[node.type].icon}
                    </span>
                    <p className="text-[14px] leading-6 text-[#3E3F3F] font-medium">
                      {node.data.label}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {isNotFound && !filterNodes.length && (
        <div className="text-center py-4">
          No nodes found matching your search criteria. Please try a different
          term.
        </div>
      )}
    </div>
  );
};

export default NodesList;
