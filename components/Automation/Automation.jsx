"use client";

import React, { useState, useCallback, useEffect } from "react";
import { hierarchy, tree } from "d3-hierarchy";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { initialEdges, initialNodes } from "@/constants";
import { nodeTypes } from "@/constants/nodeTypes";

import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { useAutomationFlowStore } from "@/store/automationFlowStore";
import { edgeTypes } from "@/constants/edgeTypes";

const Automation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { selectedNode, setSelectedNode, setSourceNode } =
    useAutomationFlowStore((state) => ({
      setSelectedNode: state.setSelectedNode,
      selectedNode: state.selectedNode,
      setSourceNode: state.setSourceNode,
    }));

  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  useEffect(() => {
    const layoutNodes = () => {
      // Create a map of nodes
      const nodesMap = nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});

      // Create a tree structure from nodes and edges
      const root = hierarchy(nodesMap["1"], (d) =>
        edges
          .filter((edge) => edge.source === d.id)
          .map((edge) => nodesMap[edge.target])
      );

      // Create a d3 tree layout
      const treeLayout = tree().nodeSize([270, 170]);
      treeLayout(root);

      // Assign calculated positions to nodes
      const layoutedNodes = nodes.map((node) => {
        const foundNode = root.descendants().find((d) => d.data.id === node.id);
        if (foundNode) {
          return {
            ...node,
            position: { x: foundNode.x, y: foundNode.y },
          };
        }
        return node;
      });

      setNodes(layoutedNodes);
    };

    layoutNodes();
  }, [nodes.length, edges.length]);

  const onConnect = useCallback((connection) => {
    // connection.sourceHandle = "bottom"; // Connect from the bottom handle
    // connection.animated = true; // Enable animation for the connection

    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodeClick = (event, node) => {
    console.log(node, "node");
    event.stopPropagation();
    setSelectedNode(node);
  };

  const onDeleteNode = (nodeId) => {
    // this code will be removed the specific node
    // setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    // setEdges((eds) =>
    //   eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    // );

    // this code will be removed all the edges connected to the specific node
    const targetNodes = edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);

    setNodes((nds) =>
      nds.filter((node) => node.id !== nodeId && !targetNodes.includes(node.id))
    );
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId &&
          !targetNodes.includes(edge.target)
      )
    );

    // setSelectedNode(null);
  };

  // const addNewNode = (sourceNodeId, node) => {
  //   const cloneNode = _.cloneDeep(node);
  //   const { group, ...rest } = cloneNode;

  //   const newNode = {
  //     id: uuidv4(),
  //     ...rest,
  //     data: {
  //       ...rest.data,
  //       onDeleteNode,
  //       onAddNode: addNewNode,
  //     },
  //     // position: { x: 0, y: 0 }, // position will be updated by layout
  //   };

  //   setNodes((nds) => nds.concat(newNode));
  //   setEdges((eds) =>
  //     eds.concat({
  //       id: `e${sourceNodeId}-${newNode.id}`,
  //       source: sourceNodeId,
  //       type: newNode.type !== "condition" && "custom",
  //       target: newNode.id,
  //     })
  //   );
  // };

  const addNewNode = (sourceNodeId, sourceNodeType, node) => {
    const cloneNode = _.cloneDeep(node);
    const { group, ...rest } = cloneNode;

    const newNodeId = uuidv4();
    setNodes((currentNodes) => {
      const newNode = {
        id: newNodeId,
        ...rest,
        data: {
          ...rest.data,
          onDeleteNode,
          onAddNode: addNewNode,
        },
        // position: { x: 0, y: 0 }, // position will be updated by layout
      };

      // Find the index of the source node in the current nodes array
      const sourceNodeIndex = currentNodes.findIndex(
        (node) => node.id === sourceNodeId
      );

      // Slice the nodes to insert the new node after the source node
      const updatedNodes = [
        ...currentNodes.slice(0, sourceNodeIndex + 1),
        newNode,
        ...currentNodes.slice(sourceNodeIndex + 1),
      ];

      return updatedNodes;
    });

    setEdges((currentEdges) => {
      // Find all edges where the source is the sourceNodeId
      const sourceEdges = currentEdges.filter(
        (edge) => edge.source === sourceNodeId
      );

      let newEdges = [];

      if (sourceEdges.length > 0 && sourceNodeType !== "ifElse") {
        // For each edge, replace the target with the new node, and create a new edge
        sourceEdges.forEach((edge) => {
          const originalTarget = edge.target;

          // New edge from sourceNodeId to newNodeId
          const newEdge1 = {
            id: `e${sourceNodeId}-${newNodeId}`,
            source: sourceNodeId,
            target: newNodeId,
            type: "custom",
          };

          // New edge from newNodeId to the original target
          const newEdge2 = {
            id: `e${newNodeId}-${originalTarget}`,
            source: newNodeId,
            target: originalTarget,
            type: "custom",
          };

          // Replace the original edge with the two new edges
          newEdges.push(newEdge1, newEdge2);
        });

        // Filter out the original edges and add the new ones
        return currentEdges
          .filter((edge) => edge.source !== sourceNodeId)
          .concat(newEdges);
      } else {
        // If there were no existing edges, create a new edge directly

        console.log("else edge block");

        const newEdge = {
          id: `e${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          type: "custom",
        };

        return [...currentEdges, newEdge];
      }
    });
  };

  const onEdgeButtonClick = (edgeId) => {
    const edge = edges.find((e) => e.id === edgeId);
    if (edge) {
      const sourceNode = nodes.find((n) => n.id === edge.source);

      setSourceNode({
        ...sourceNode,
        data: { ...sourceNode.data, onDeleteNode, onAddNode: addNewNode },
      });

      console.log("clicked edge", sourceNode, edgeId);
    }
  };

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem("flowKey", JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem("flowKey"));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  useEffect(() => {
    if (selectedNode) {
      const node = nodes.find((n) => n.id === selectedNode.id);

      if (node) {
        node.data = { ...node.data, ...selectedNode.data };
      }

      onNodesChange([node]);
    }
  }, [selectedNode]);

  return (
    <div style={{ display: "flex" }}>
      <div className="automation__canvas w-full h-[900px]">
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onDeleteNode,
              onAddNode: addNewNode,
            },
          }))}
          edges={edges.map((edge) => ({
            ...edge,
            data: { onEdgeButtonClick },
          }))}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 2 }}
        >
          <Controls />
          <Background color="#aaa" />
          <Panel position="top-right">
            <button onClick={onSave}>save</button>
            <button onClick={onRestore}>restore</button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <Automation />
  </ReactFlowProvider>
);
