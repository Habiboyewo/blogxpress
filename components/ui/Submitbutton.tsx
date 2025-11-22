
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {
  disabled?: boolean;
};

export function Submitbutton({ disabled }: Props = {}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className="mt-6 w-full py-3 text-base font-semibold"
    >
      {pending ? "Publishing…" : "Publish Post"}
    </Button>
  );
}