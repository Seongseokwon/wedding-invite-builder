"use client";
import { useDrag } from "react-dnd";
import React from "react";

const COMPONENT_TYPE = "COMPONENT";

export type ComponentItem = {
  type: string;
  label: string;
  icon: React.ReactNode;
};

export default function DraggableComponent({
  component,
}: {
  component: ComponentItem;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: COMPONENT_TYPE,
    item: { type: component.type, label: component.label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <button
      ref={drag as unknown as React.Ref<HTMLButtonElement>}
      className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border border-gray-200 bg-white hover:bg-purple-50 transition text-xs shadow-sm select-none cursor-move ${
        isDragging ? "opacity-40" : ""
      }`}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      type="button"
    >
      {component.icon}
      <span className="text-gray-800">{component.label}</span>
    </button>
  );
}
