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
import { Button } from "@/components/ui/button";

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
  const [tempSelectedNode, setTempSelectedNode] = useState(null);
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

    if (node.type === "ifElse") {
      const targets = edges
        .filter((item) => item.source === node.id)
        .map((item) => item.target);

      const children = targets.map((item) =>
        nodes.find((node) => item === node.id)
      );

      return setSelectedNode({ ...node, children: children });
    }

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
    const previousEdge = edges.find((edge) => edge.target === nodeId);
    const previousNodeId = previousEdge?.source;
    const previousNode = nodes.find((node) => node.id === previousNodeId);

    // Get all nodes connected to the node being deleted
    const subsequentNodes = findAllSubsequentNodes(nodeId, edges);

    // Create a new "end" node
    const newEndNodeId = `end-${uuidv4()}`;

    if (previousNode && previousNode.type !== "ifElse") {
      const newEndNode = {
        id: newEndNodeId,
        type: "end",
        data: { label: "End" },
        position: { x: 0, y: 0 }, // Update with appropriate position
      };

      setNodes((nds) => [
        ...nds.filter(
          (node) => node.id !== nodeId && !subsequentNodes.includes(node.id)
        ),
        newEndNode,
      ]);
    } else {
      setNodes((nds) => [
        ...nds.filter(
          (node) => node.id !== nodeId && !subsequentNodes.includes(node.id)
        ),
      ]);
    }

    const getFilteredEgdes = (eds) => {
      return eds.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId &&
          !subsequentNodes.includes(edge.target)
      );
    };

    // Update edges
    if (previousNode && previousNode.type !== "ifElse") {
      setEdges((eds) => {
        // Filter out the edges connected to the node and its subsequent nodes
        const filteredEdges = getFilteredEgdes(eds);

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
    } else {
      setEdges((eds) => {
        // Filter out the edges connected to the node and its subsequent nodes
        const filteredEdges = getFilteredEgdes(eds);

        return filteredEdges;
      });
    }
  };

  const addNewNode = (sourceNodeId, sourceNodeType, node) => {
    const cloneNode = _.cloneDeep(node);
    const { group, ...rest } = cloneNode;

    let conditionNodeId1;
    let conditionNodeId2;
    let endNodeId1;
    let endNodeId2;
    let tempNodes;

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
        conditionNodeId1 = "condition1" + nodes.length + 1;
        conditionNodeId2 = "condition1" + nodes.length + 2;
        endNodeId1 = "end1" + nodes.length + 1;

        const conditionNode1 = {
          id: conditionNodeId1,
          type: "condition",
          data: {
            label: "Condition 1",
            onDeleteNode,
            onAddNode: addNewNode,
          },
          position: { x: 0, y: 0 },
        };

        const conditionNode2 = {
          id: conditionNodeId2,
          type: "condition",
          data: {
            label: "Condition 2",
            onDeleteNode,
            onAddNode: addNewNode,
          },
          position: { x: 0, y: 0 },
        };

        const endNode1 = {
          id: endNodeId1,
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
        endNodeId2 = "end2" + newNodeId;

        const endNode2 = {
          id: endNodeId2,
          type: "end",
          data: { label: "End" },
          position: { x: 0, y: 0 },
        };

        updatedNodes = [...updatedNodes, endNode2];
      }

      tempNodes = updatedNodes;
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
              id: `e${newNodeId}-${conditionNodeId1}`,
              source: newNodeId,
              target: conditionNodeId1,
              // type: "custom",
            };

            newEdge4 = {
              id: `e${newNodeId}-${conditionNodeId2}`,
              source: newNodeId,
              target: conditionNodeId2,
              // type: "custom",
            };

            newEdge2.source = newEdge3.target;

            newEdge5 = {
              id: `e${conditionNodeId2}-${endNodeId1}`,
              source: conditionNodeId2,
              target: endNodeId1,
              type: "custom",
            };
          }

          if (newEdge3 && newEdge4 && newEdge5) {
            newEdges.push(newEdge1, newEdge2, newEdge3, newEdge4, newEdge5);
          } else {
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
          id: `e${newNodeId}-${endNodeId2}`,
          source: newNodeId,
          target: endNodeId2,
          type: "custom",
        };

        let updatedEds = [...currentEdges, newEdge, newEdge2];

        const sourceNode = tempNodes.find((node) => node.id === sourceNodeId);

        // after adding new condition to the if else state update the selected state children
        if (sourceNode) {
          const targets = updatedEds
            .filter((item) => item.source === sourceNodeId)
            .map((item) => item.target);

          const children = targets.map((item) =>
            tempNodes.find((node) => item === node.id)
          );

          setTempSelectedNode({ ...sourceNode, children: children });
        }

        return updatedEds;
      }
    });
  };

  useEffect(() => {
    if (tempSelectedNode) {
      setSelectedNode(tempSelectedNode);
    }
  }, [tempSelectedNode]);

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
      // Find the main node by ID
      const node = nodes.find((n) => n.id === selectedNode.id);

      if (node) {
        // Update the main node's data
        node.data = { ...node.data, ...selectedNode.data };

        // Check if the node is of type 'ifelse'
        if (node.type === "ifElse" && selectedNode.children) {
          // Find and update the child nodes in the nodes array
          selectedNode.children.forEach((child) => {
            const childNode = nodes.find((n) => n.id === child.id);
            if (childNode) {
              childNode.data = { ...childNode.data, ...child.data };
            }
          });
        }

        // Trigger the nodes change callback with all updated nodes
        onNodesChange(nodes);
      }
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
          // onConnect={onConnect}
          onInit={setRfInstance}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 2 }}
        >
          <Controls />
          <Background color="#aaa" />
          <Panel position="top-right">
            <Button onClick={onSave} className="mr-3">
              save
            </Button>
            <Button onClick={onRestore}>restore</Button>
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
