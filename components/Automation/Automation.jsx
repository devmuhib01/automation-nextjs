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
    event.stopPropagation();
    setSelectedNode(node);
  };

  const onDeleteNode = (nodeId) => {
    const findAllSubsequentNodes = (currentNodeId, allEdges) => {
      const directChildNodes = allEdges
        .filter((edge) => edge.source === currentNodeId)
        .map((edge) => edge.target);

      let allSubsequentNodes = [...directChildNodes];

      // Recursively find all child nodes
      directChildNodes.forEach((childNodeId) => {
        allSubsequentNodes = [
          ...allSubsequentNodes,
          ...findAllSubsequentNodes(childNodeId, allEdges),
        ];
      });

      return allSubsequentNodes;
    };

    // Find the previous node that connects to the node being deleted
    const previousNodeId = edges.find((edge) => edge.target === nodeId)?.source;

    // Get all nodes connected to the node being deleted
    const subsequentNodes = findAllSubsequentNodes(nodeId, edges);

    // Create a new "end" node
    const newEndNodeId = `end-${uuidv4()}`;
    const newEndNode = {
      id: newEndNodeId,
      type: "end",
      data: { label: "End" },
      position: { x: 0, y: 0 }, // Update with appropriate position
    };

    // Update nodes and edges
    setNodes((nds) => [
      ...nds.filter(
        (node) => node.id !== nodeId && !subsequentNodes.includes(node.id)
      ),
      newEndNode,
    ]);

    setEdges((eds) => {
      // Filter out the edges connected to the node and its subsequent nodes
      const filteredEdges = eds.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId &&
          !subsequentNodes.includes(edge.target)
      );

      // Create a new edge from the previous node to the new end node
      if (previousNodeId) {
        const newEdge = {
          id: `e${previousNodeId}-${newEndNodeId}`,
          source: previousNodeId,
          target: newEndNodeId,
          type: "custom",
        };
        return [...filteredEdges, newEdge];
      }

      return filteredEdges;
    });
  };

  const addNewNode = (sourceNodeId, sourceNodeType, node) => {
    const cloneNode = _.cloneDeep(node);
    const { group, ...rest } = cloneNode;

    let conditionId1;
    let conditionId2;
    let endId1;
    let endId2;

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
      let updatedNodes = [
        ...currentNodes.slice(0, sourceNodeIndex + 1),
        newNode,
        ...currentNodes.slice(sourceNodeIndex + 1),
      ];

      if (node.type === "ifElse") {
        // Create condition and end nodes
        conditionId1 = "condition1" + nodes.length + 1;
        conditionId2 = "condition1" + nodes.length + 2;
        endId1 = "end1" + nodes.length + 1;

        const conditionNode1 = {
          id: conditionId1,
          type: "condition",
          data: {
            label: "Condition 1",
            onDeleteNode,
            onAddNode: addNewNode,
          },
          position: { x: 0, y: 0 },
        };
        const conditionNode2 = {
          id: conditionId2,
          type: "condition",
          data: {
            label: "Condition 2",
            onDeleteNode,
            onAddNode: addNewNode,
          },
          position: { x: 0, y: 0 },
        };

        const endNode1 = {
          id: endId1,
          type: "end",
          data: { label: "End" },
          position: { x: 0, y: 0 },
        };

        updatedNodes = [
          ...updatedNodes,
          conditionNode1,
          conditionNode2,
          endNode1,
        ];
      }

      if (sourceNodeType === "ifElse") {
        endId2 = "end2" + newNodeId;

        const endNode2 = {
          id: endId2,
          type: "end",
          data: { label: "End" },
          position: { x: 0, y: 0 },
        };

        updatedNodes = [...updatedNodes, endNode2];
      }

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

          let newEdge3;
          let newEdge4;
          let newEdge5;

          if (node.type === "ifElse") {
            newEdge3 = {
              id: `e${newNodeId}-${conditionId1}`,
              source: newNodeId,
              target: conditionId1,
              // type: "custom",
            };

            newEdge4 = {
              id: `e${newNodeId}-${conditionId2}`,
              source: newNodeId,
              target: conditionId2,
              // type: "custom",
            };

            newEdge2.source = newEdge3.target;

            newEdge5 = {
              id: `e${conditionId2}-${endId1}`,
              source: conditionId2,
              target: endId1,
              type: "custom",
            };
          }

          if (newEdge3 && newEdge4 && newEdge5) {
            newEdges.push(newEdge1, newEdge2, newEdge3, newEdge4, newEdge5);
          } else {
            console.log("Error: IfElse edge block not found");
            newEdges.push(newEdge1, newEdge2);
          }
        });

        // Filter out the original edges and add the new ones
        return currentEdges
          .filter((edge) => edge.source !== sourceNodeId)
          .concat(newEdges);
      } else {
        // If there were no existing edges, create a new edge directly
        const newEdge = {
          id: `e${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          // type: "custom",
        };

        const newEdge2 = {
          id: `e${newNodeId}-${endId2}`,
          source: newNodeId,
          target: endId2,
          type: "custom",
        };

        return [...currentEdges, newEdge, newEdge2];
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
