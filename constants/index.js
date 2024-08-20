import { v4 as uuidv4 } from "uuid";
import CreateContactIcon from "@/assets/Svg/CreateContact";
import UpdateContactIcon from "@/assets/Svg/UpdateContact";
import DeleteContactIcon from "@/assets/Svg/DeleteContact";
import AddTag from "@/assets/Svg/AddTag";
import RemoveTag from "@/assets/Svg/RemoveTag";
import AddNote from "@/assets/Svg/AddNote";
import AddList from "@/assets/Svg/AddList";
import AddPipeline from "@/assets/Svg/AddPipeline";
import RemovePipeline from "@/assets/Svg/RemovePipeline";
import AssignTask from "@/assets/Svg/AssignTask";
import SendEmail from "@/assets/Svg/SendEmail";
import IfElse from "@/assets/Svg/IfElse";
import EditAddToList from "@/components/Sidebar/NodeEditComponents/EditAddToList";
import EditMoveToList from "@/components/Sidebar/NodeEditComponents/EditMoveToList";
import EditIfElseCondition from "@/components/Sidebar/NodeEditComponents/EditIfElseCondition";
import EditInputNode from "@/components/Sidebar/NodeEditComponents/EditInputNode";
import EditAddTag from "@/components/Sidebar/NodeEditComponents/EditAddTag";
import EditRemoveTag from "@/components/Sidebar/NodeEditComponents/EditRemoveTag";
import EditUpdateContact from "@/components/Sidebar/NodeEditComponents/EditUpdateContact";
import EditCreateContact from "@/components/Sidebar/NodeEditComponents/EditCreateContact";
import EditEndNode from "@/components/Sidebar/NodeEditComponents/EditEndNode";
import EditAddNote from "@/components/Sidebar/NodeEditComponents/EditAddNote";
import EditAssignTask from "@/components/Sidebar/NodeEditComponents/EditAssignTask";
import EditAddPipeline from "@/components/Sidebar/NodeEditComponents/EditAddPipeline";
import EditPipelineStage from "@/components/Sidebar/NodeEditComponents/EditPipelineStage";
import EditRemovePipeline from "@/components/Sidebar/NodeEditComponents/EditRemovePipeline";
import EditEmail from "@/components/Sidebar/NodeEditComponents/EditEmail";

export const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start your automation" },
    position: { x: 0, y: 0 },
  },

  {
    id: "2",
    type: "end",
    data: { label: "End" },
    position: { x: 0, y: 0 },
  },
];

export const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "custom" },
];

export const nodeTypeOptions = [
  {
    group: "contact",
    type: "createContact",
    data: { label: "Contact Created" },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "updateContact",
    data: {
      label: "Update Contact Field",
      actionType: "",
      fields: [{ name: "city", value: "Sylhet" }],
    },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "addToList",
    data: { label: "Add To List", list: null },
    position: { x: 0, y: 0 },
  },
  {
    type: "moveToList",
    group: "contact",
    data: { label: "Move to another List", list: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "addTag",
    data: { label: "Add Tag", tags: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "removeTag",
    data: { label: "Remove Tag", tags: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "addNote",
    data: { label: "Add Notes", note: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "assignTask",
    data: { label: "Assign Task", project: null, stage: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "pipeline",
    type: "addPipeline",
    data: { label: "Add to Pipeline", pipeline: null, stage: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "pipeline",
    type: "removePipeline",
    data: { label: "Remove to Pipeline", pipeline: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "pipeline",
    type: "pipelineStageChange",
    data: { label: "Pipeline Stage Change", pipeline: null, stage: null },
    position: { x: 0, y: 0 },
  },
  {
    group: "email",
    type: "email",
    data: {
      label: "Send an Email",
      fromEmail: null,
      fromName: null,
      subject: null,
      message: null,
      template: null,
    },
    position: { x: 0, y: 0 },
  },

  {
    group: "condition",
    type: "ifElse",
    data: { label: "Condition" },
    position: { x: 0, y: 0 },
  },
];

export const nodesIcon = {
  ifElse: { icon: <IfElse />, bg: "#F2F5F5" },
  createContact: { icon: <CreateContactIcon />, bg: "#F2F5F5" },
  updateContact: { icon: <UpdateContactIcon />, bg: "#F2F5F5" },
  addToList: { icon: <AddList />, bg: "#F2F5F5" },
  moveToList: { icon: <AddList />, bg: "#F2F5F5" },
  addTag: { icon: <AddTag />, bg: "#F2F5F5" },
  removeTag: { icon: <RemoveTag />, bg: "#F2F5F5" },
  addNote: { icon: <AddNote />, bg: "#F2F5F5" },
  assignTask: { icon: <AssignTask />, bg: "#F2F5F5" },
  addPipeline: { icon: <AddPipeline />, bg: "#F2F5F5" },
  removePipeline: { icon: <RemovePipeline />, bg: "#F2F5F5" },
  pipelineStageChange: { icon: <AddPipeline />, bg: "#F2F5F5" },
  email: { icon: <SendEmail />, bg: "#F2F5F5" },
};

export const getNodeEditComponent = {
  input: <EditInputNode />,
  createContact: <EditCreateContact />,
  updateContact: <EditUpdateContact />,
  addToList: <EditAddToList />,
  moveToList: <EditMoveToList />,
  addTag: <EditAddTag />,
  removeTag: <EditRemoveTag />,
  addNote: <EditAddNote />,
  assignTask: <EditAssignTask />,
  addPipeline: <EditAddPipeline />,
  removePipeline: <EditRemovePipeline />,
  pipelineStageChange: <EditPipelineStage />,
  email: <EditEmail />,
  ifElse: <EditIfElseCondition />,
  end: <EditEndNode />,
};
