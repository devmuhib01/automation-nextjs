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
    type: "ifElse",
    data: { label: "Condition" },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "contact",
    data: { label: "Contact Created" },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "updateContact",
    data: {
      label: "Update Contact Field",
      type: "",
      fields: [{ name: "city", value: "Sylhet" }],
    },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "addToList",
    data: { label: "Add To List", list: [] },
    position: { x: 0, y: 0 },
  },
  {
    type: "moveToList",
    group: "contact",
    data: { label: "Move to another List", list: [] },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "addTag",
    data: { label: "Add Tag", tags: [] },
    position: { x: 0, y: 0 },
  },
  {
    group: "contact",
    type: "removeTag",
    data: { label: "Remove Tag", tags: [] },
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
    data: { label: "Assign Task", project: {}, stage: {} },
    position: { x: 0, y: 0 },
  },
  {
    group: "pipeline",
    type: "addPipeline",
    data: { label: "Add to Pipeline", pipeline: [], stage: {} },
    position: { x: 0, y: 0 },
  },
  {
    group: "pipeline",
    type: "removePipeline",
    data: { label: "Remove to Pipeline", pipeline: [] },
    position: { x: 0, y: 0 },
  },
  {
    group: "pipeline",
    type: "pipelineStageChange",
    data: { label: "Pipeline Stage Change", pipeline: [], stage: {} },
    position: { x: 0, y: 0 },
  },
  {
    group: "email",
    type: "email",
    data: { label: "Send an Email" },
    position: { x: 0, y: 0 },
  },
];

export const nodesIcon = {
  ifElse: { icon: <IfElse />, bg: "#F2F5F5" },
  contact: { icon: <CreateContactIcon />, bg: "#F2F5F5" },
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
