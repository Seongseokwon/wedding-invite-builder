"use client";
import DraggableComponent, { ComponentItem } from "./DraggableComponent";
import React from "react";

export default function ComponentPanel({
  components,
}: {
  components: ComponentItem[];
}) {
  return (
    <aside className="w-64 bg-white border-r flex flex-col p-4 gap-4 min-h-0">
      <div className="font-semibold text-gray-900 mb-2">구성 요소</div>
      {/* 검색창 */}
      <input
        type="text"
        placeholder="구성 요소 검색..."
        className="mb-3 px-3 py-2 rounded border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
      />
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
        {/* 기본 요소 */}
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-2">
            <span>📚</span>기본 요소
          </div>
          <div className="grid grid-cols-2 gap-2">
            {components.slice(0, 4).map((c) => (
              <DraggableComponent key={c.type} component={c} />
            ))}
          </div>
        </div>
        {/* 미디어 */}
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-2 mt-1">
            <span>🎞️</span>미디어
          </div>
          <div className="grid grid-cols-2 gap-2">
            {components.slice(4, 6).map((c) => (
              <DraggableComponent key={c.type} component={c} />
            ))}
          </div>
        </div>
        {/* 인터랙티브 */}
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-2 mt-1">
            <span>🧩</span>인터랙티브
          </div>
          <div className="grid grid-cols-2 gap-2">
            {components.slice(6, 10).map((c) => (
              <DraggableComponent key={c.type} component={c} />
            ))}
          </div>
        </div>
        {/* 스타일 */}
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-2 mt-1">
            <span>🎨</span>스타일
          </div>
          <div className="grid grid-cols-2 gap-2">
            {components.slice(10, 12).map((c) => (
              <DraggableComponent key={c.type} component={c} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
