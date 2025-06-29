"use client";
import DraggableComponent, { ComponentItem } from "./DraggableComponent";
import React from "react";

export default function ComponentPanel({
  components,
}: {
  components: ComponentItem[];
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <div className="font-semibold text-gray-900 mb-3">구성 요소</div>
        {/* 검색창 */}
        <input
          type="text"
          placeholder="구성 요소 검색..."
          className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* 기본 요소 */}
          <div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-3">
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
            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-3">
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
            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-3">
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
            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mb-3">
              <span>🎨</span>스타일
            </div>
            <div className="grid grid-cols-2 gap-2">
              {components.slice(10, 12).map((c) => (
                <DraggableComponent key={c.type} component={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
