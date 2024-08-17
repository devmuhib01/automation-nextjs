import AddNote from "@/components/Nodes/AddNote";
import AddPipelineNode from "@/components/Nodes/AddPipelineNode";
import RemovePipelineNode from "@/components/Nodes/RemovePipelineNode";
import AddTagNode from "@/components/Nodes/AddTagNode";
import AddToListNode from "@/components/Nodes/AddToListNode";
import AssignTaskNode from "@/components/Nodes/AssignTaskNode";
import CreateContactNode from "@/components/Nodes/CreateContactNode";
import EndNode from "@/components/Nodes/EndNode";
import InputNode from "@/components/Nodes/InputNode";
import MoveToListNode from "@/components/Nodes/MoveToListNode";
import RemoveTagNode from "@/components/Nodes/RemoveTagNode";
import UpdateContactNode from "@/components/Nodes/UpdateContactNode";
import PipelineStageNode from "@/components/Nodes/PipelineStageNode";
import EmailNode from "@/components/Nodes/EmailNode";
import IfElseCondition from "@/components/Nodes/IfElseCondition";

export const nodeTypes = {
  input: InputNode,
  contact: CreateContactNode,
  updateContact: UpdateContactNode,
  addToList: AddToListNode,
  moveToList: MoveToListNode,
  addTag: AddTagNode,
  removeTag: RemoveTagNode,
  addNote: AddNote,
  assignTask: AssignTaskNode,
  addPipeline: AddPipelineNode,
  removePipeline: RemovePipelineNode,
  pipelineStageChange: PipelineStageNode,
  email: EmailNode,
  end: EndNode,
  ifElse: IfElseCondition,
};
