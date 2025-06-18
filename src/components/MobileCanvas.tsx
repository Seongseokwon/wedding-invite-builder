"use client";
import { useDrop } from "react-dnd";
import React from "react";

const COMPONENT_TYPE = "COMPONENT";

// DropZone 컴포넌트 (각 위치마다)
function DropZone({
  dropIndex,
  onDrop,
}: {
  dropIndex: number;
  onDrop: (item: { type: string; label: string }, dropIndex: number) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: COMPONENT_TYPE,
      drop: (item: { type: string; label: string }, monitor) => {
        if (monitor.didDrop()) return;
        onDrop(item, dropIndex);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDrop, dropIndex]
  );
  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`h-4 w-full my-1 rounded transition-all duration-150 ${
        isOver && canDrop ? "bg-purple-200" : "bg-transparent"
      }`}
      style={{ minHeight: 8 }}
    />
  );
}

export default function MobileCanvas({
  canvasItems,
  onDrop,
  onSelect,
  selectedIndex,
}: {
  canvasItems: { type: string; label: string }[];
  onDrop: (item: { type: string; label: string }, dropIndex: number) => void;
  onSelect: (idx: number) => void;
  selectedIndex: number | null;
}) {
  // 캔버스 전체에 드랍(맨 마지막)
  const [{ isOver: isOverCanvas, canDrop: canDropCanvas }, dropCanvas] =
    useDrop(
      () => ({
        accept: COMPONENT_TYPE,
        drop: (item: { type: string; label: string }, monitor) => {
          if (monitor.didDrop()) return;
          onDrop(item, canvasItems.length);
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [canvasItems.length, onDrop]
    );

  return (
    <div
      ref={dropCanvas as unknown as React.Ref<HTMLDivElement>}
      className={`w-[340px] h-[700px] bg-gradient-to-b from-orange-50 to-white rounded-[40px] border-4 border-gray-300 shadow-2xl flex flex-col items-center justify-center relative transition-all duration-200 ${
        isOverCanvas && canDropCanvas ? "ring-4 ring-purple-300" : ""
      }`}
    >
      {/* 상단 바(모바일) */}
      <div className="absolute top-0 left-0 w-full h-8 flex items-center justify-between px-6 text-xs text-gray-500">
        <span>9:41</span>
        <span className="flex gap-1 items-center">
          <span className="w-3 h-3 bg-green-200 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full inline-block"></span>
        </span>
      </div>
      {/* 드롭존/캔버스 */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 overflow-y-auto">
        {canvasItems.length === 0 ? (
          <div className="border-2 border-dashed border-gray-400 rounded-lg w-56 h-56 flex flex-col items-center justify-center text-gray-500 text-center bg-white/60">
            <span className="text-3xl mb-2">＋</span>
            <span className="text-sm">
              구성 요소를 여기에
              <br />
              드래그하세요
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-0 items-center">
            {/* 맨 위 드랍존 */}
            <DropZone dropIndex={0} onDrop={onDrop} />
            {canvasItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <button
                  type="button"
                  onClick={() => onSelect(idx)}
                  className={`w-full bg-white border rounded p-2 text-center text-gray-800 shadow-sm text-sm transition-all duration-150 outline-none ${
                    selectedIndex === idx
                      ? "border-purple-500 ring-2 ring-purple-200"
                      : "border-gray-200"
                  }`}
                >
                  {item.label}
                </button>
                {/* 각 요소 아래 드랍존 (마지막 요소는 dropCanvas로 대체) */}
                <DropZone dropIndex={idx + 1} onDrop={onDrop} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
