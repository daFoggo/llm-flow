import { DocumentsManagementBlock } from "@/features/chat-models";

const ChatModelsPage = () => {
  return (
    <div className="p-4 flex justify-around gap-4 h-[calc(100dvh-var(--dashboard-header-height-with-margin))] overflow-auto">
      <DocumentsManagementBlock />
    </div>
  );
};

export default ChatModelsPage;
