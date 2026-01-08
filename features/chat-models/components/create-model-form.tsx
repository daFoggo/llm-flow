"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createChatModelAction } from "../actions/chat-model.action";

export function CreateModelForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const name = formData.get("name") as string;

    const result = await createChatModelAction({ name, provider: "openai" });

    if (!result.success) {
      alert(result.error);
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="flex items-end gap-2">
      <FieldGroup className="w-full max-w-sm">
        <Field>
          <FieldLabel htmlFor="model-name">Model Name</FieldLabel>
          <Input
            id="model-name"
            name="name"
            placeholder="Model name..."
            required
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create New"}
      </Button>
    </form>
  );
}
