import { DocumentsManagementBlock } from "@/features/chat-models";

const ChatModelsPage = () => {
  return (
    <div className="p-4 flex justify-around gap-4 flex-1">
      <DocumentsManagementBlock />
      <DocumentsManagementBlock />
      <DocumentsManagementBlock />
    </div>
  );
};

export default ChatModelsPage;
