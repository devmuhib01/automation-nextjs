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
import NodesSidebar from "@/components/Sidebar/NodesSidebar";

const Automation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

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
      const treeLayout = tree().nodeSize([150, 150]);
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
    connection.animated = true; // Enable animation for the connection

    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodeClick = (event, node) => {
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

    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const addNewNode = (sourceNodeId, nodeType) => {
    const newNodeId = Math.floor(Math.random() * 99999) + 1;

    const newNode = {
      id: newNodeId.toString(),
      type: nodeType,
      data: {
        label: `New  ${nodeType} ${newNodeId}`,
        onDeleteNode,
        onAddNode: addNewNode,
      },
      position: { x: 0, y: 0 }, // position will be updated by layout
    };
    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) =>
      eds.concat({
        id: `e${sourceNodeId}-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId.toString(),
        animated: true,
      })
    );
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

  return (
    <ReactFlowProvider>
      <div style={{ display: "flex" }}>
        <div className="automation__canvas w-[80%] h-[800px]">
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              type: node.type || "default",
              data: {
                ...node.data,
                onDeleteNode,
                onAddNode: addNewNode,
              },
            }))}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onInit={setRfInstance}
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

        <NodesSidebar />

        {/* {selectedNode && (
          <div
            style={{
              width: "30%",
              padding: "20px",
              borderLeft: "1px solid #ccc",
            }}
          >
            <h3>Node Details</h3>
            <p>ID: {selectedNode.id}</p>
            <p>Type: {selectedNode.type}</p>
            <p>Label: {selectedNode.data.label}</p>
            <button onClick={() => addNewNode(selectedNode.id)}>
              Add New Node
            </button>
          </div>
        )} */}
      </div>
    </ReactFlowProvider>
  );
};

export default Automation;
