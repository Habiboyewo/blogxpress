"use client"
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export function Submitbutton() {
  const { pending } = useFormStatus();

  return <Button className="w-[100%] md:w-[70%] mx-auto mt-2" type="submit" disabled={pending}>{pending ? "submitting" : "Submit"}</Button>
}
