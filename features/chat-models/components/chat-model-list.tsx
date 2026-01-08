import type { ChatModel } from "../types/chat-model";

interface ChatModelListProps {
  data: ChatModel[];
}

export function ChatModelList({ data }: ChatModelListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((model) => (
        <div key={model.id} className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-semibold">{model.name}</h3>
          <p className="text-sm text-muted-foreground">{model.provider}</p>
        </div>
      ))}
    </div>
  );
}
