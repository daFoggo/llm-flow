import { DocumentsManagementBlock } from "@/features/chat-models";

const ChatModelsPage = () => {
  return (
    <div className="p-4 flex justify-around gap-4 h-full">
      <DocumentsManagementBlock />
      <DocumentsManagementBlock />
      <DocumentsManagementBlock />
    </div>
  );
};

export default ChatModelsPage;
