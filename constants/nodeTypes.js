import CreateContactNode from "@/components/Nodes/CreateContactNode";
import EndNode from "@/components/Nodes/EndNode";
import InputNode from "@/components/Nodes/InputNode";
import UpdateContactNode from "@/components/Nodes/UpdateContactNode";

export const nodeTypes = {
  input: InputNode,
  contact: CreateContactNode,
  updateContact: UpdateContactNode,
  end: EndNode,
};
