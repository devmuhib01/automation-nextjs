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
  Handle,
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

  const addNewNodeBelow = (sourceNode, edgeId) => {
    console.log("getting", sourceNode, edgeId);
    const newNode = {
      id: `${nodes.length + 1}`,
      type: "email",
      data: { label: `New Node ${nodes.length + 1}` },
      position: { x: 0, y: 0 },
    };
    setNodes((nds) => nds.concat(newNode));

    // Update edges
    const updatedEdges = edges.map((edge) => {
      if (edge.id === edgeId) {
        return {
          ...edge,
          target: newNode.id,
        };
      }
      return edge;
    });

    // setEdges((eds) => eds.concat(updatedEdges));

    // Set the new edges
    // Set the new edges using concat
    // setEdges((eds) =>
    //   eds.concat({
    //     id: `e${newNode.id}-${sourceNode.id}`,
    //     source: newNode.id,
    //     target: sourceNode.id,
    //     type: "custom",
    //     data: { onEdgeButtonClick },
    //   })
    // );

    // setEdges([
    //   ...updatedEdges,
    //   {
    //     id: `e${newNode.id}-${sourceNode.id}`,
    //     source: newNode.id,
    //     target: sourceNode.id,
    //     animated: true,
    //     type: "custom",
    //     data: { onEdgeButtonClick },
    //   },
    // ]);
  };

  const addNewNode = (sourceNodeId, node) => {
    const cloneNode = _.cloneDeep(node);
    const { group, ...rest } = cloneNode;

    const newNode = {
      id: uuidv4(),
      ...rest,
      data: {
        ...rest.data,
        onDeleteNode,
        onAddNode: addNewNode,
      },
      // position: { x: 0, y: 0 }, // position will be updated by layout
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) =>
      eds.concat({
        id: `e${sourceNodeId}-${newNode.id}`,
        source: sourceNodeId,
        type: newNode.type !== "condition" && "custom",
        target: newNode.id,
      })
    );
  };

  const onEdgeButtonClick = (edgeId) => {
    // Handle the logic to open the sidebar and add a new node
    const edge = edges.find((e) => e.id === edgeId);
    if (edge) {
      const sourceNode = nodes.find((n) => n.id === edge.source);

      setSourceNode({
        ...sourceNode,
        data: { ...sourceNode.data, onDeleteNode, onAddNode: addNewNode },
      });
      // addNewNodeBelow(sourceNode, edgeId);
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
        // setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes]);

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
    <ReactFlowProvider>
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
    </ReactFlowProvider>
  );
};

export default Automation;
