"use client";
import { useDrop } from "react-dnd";
import React, { useRef } from "react";
import CanvasComponent, { CanvasItem } from "./CanvasComponent";

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
      className={`h-4 w-full my-2 rounded transition-all duration-150 ${
        isOver && canDrop ? "bg-purple-200" : "bg-transparent"
      }`}
      style={{ minHeight: 8 }}
    />
  );
}

export default function Canvas({
  canvasItems,
  onDrop,
  onSelect,
  selectedIndex,
}: {
  canvasItems: CanvasItem[];
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

  // 이미지 업로드 관련
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // 이미지 요소 추가
      onDrop({ type: "image", label: "이미지" }, canvasItems.length);
      setTimeout(() => {
        // 이미지 요소가 추가된 후 마지막 요소에 이미지 URL을 넣기 위해 setTimeout 사용
        const event = new CustomEvent("canvas-image-upload", { detail: ev.target?.result });
        window.dispatchEvent(event);
      }, 0);
    };
    reader.readAsDataURL(file);
  };
  // 이미지 요소에 이미지 URL을 넣는 로직은 page.tsx에서 처리

  return (
    <div
      ref={dropCanvas as unknown as React.Ref<HTMLDivElement>}
      className={`w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border-2 border-dashed transition-all duration-200 ${
        isOverCanvas && canDropCanvas 
          ? "border-purple-400 bg-purple-50" 
          : "border-gray-300"
      }`}
      style={{ minHeight: "600px", maxHeight: "80vh", overflowY: "auto" }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            onDrop({ type: "image", label: "이미지" }, canvasItems.length);
            setTimeout(() => {
              const event = new CustomEvent("canvas-image-upload", { detail: ev.target?.result });
              window.dispatchEvent(event);
            }, 0);
          };
          reader.readAsDataURL(file);
        }
      }}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="p-6">
        {canvasItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500 select-none">
            <div className="text-6xl mb-4">＋</div>
            <p className="text-lg font-medium mb-2">청첩장을 만들어보세요</p>
            <p className="text-sm text-gray-400">
              왼쪽에서 구성 요소를 드래그하여 추가하세요
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 맨 위 드랍존 */}
            <DropZone dropIndex={0} onDrop={onDrop} />
            
            {canvasItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <CanvasComponent
                  item={item}
                  isSelected={selectedIndex === idx}
                  onClick={() => onSelect(idx)}
                />
                {/* 각 요소 아래 드랍존 */}
                <DropZone dropIndex={idx + 1} onDrop={onDrop} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 