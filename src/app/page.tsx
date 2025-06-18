"use client";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ComponentPanel from "../components/ComponentPanel";
import MobileCanvas from "../components/MobileCanvas";
import {
  Text,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Images,
  Video,
  Timer,
  BookText,
  ListTodo,
  CreditCard,
  Paintbrush,
  MinusSquare,
  Trash2,
} from "lucide-react";

const COMPONENTS = [
  {
    type: "text",
    label: "텍스트",
    icon: <Text className="text-purple-500 w-6 h-6" />,
  },
  {
    type: "image",
    label: "이미지",
    icon: <ImageIcon className="text-purple-500 w-6 h-6" />,
  },
  {
    type: "date",
    label: "일정",
    icon: <Calendar className="text-purple-500 w-6 h-6" />,
  },
  {
    type: "location",
    label: "위치",
    icon: <MapPin className="text-purple-500 w-6 h-6" />,
  },
  {
    type: "gallery",
    label: "갤러리",
    icon: <Images className="text-pink-500 w-6 h-6" />,
  },
  {
    type: "video",
    label: "동영상",
    icon: <Video className="text-pink-500 w-6 h-6" />,
  },
  {
    type: "countdown",
    label: "카운트다운",
    icon: <Timer className="text-blue-500 w-6 h-6" />,
  },
  {
    type: "guestbook",
    label: "방명록",
    icon: <BookText className="text-blue-500 w-6 h-6" />,
  },
  {
    type: "timeline",
    label: "타임라인",
    icon: <ListTodo className="text-blue-500 w-6 h-6" />,
  },
  {
    type: "account",
    label: "계좌정보",
    icon: <CreditCard className="text-blue-500 w-6 h-6" />,
  },
  {
    type: "background",
    label: "배경",
    icon: <Paintbrush className="text-yellow-500 w-6 h-6" />,
  },
  {
    type: "divider",
    label: "구분선",
    icon: <MinusSquare className="text-yellow-500 w-6 h-6" />,
  },
];

export default function Home() {
  const [canvasItems, setCanvasItems] = useState<
    { type: string; label: string }[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDrop = (
    item: { type: string; label: string },
    dropIndex: number
  ) => {
    setCanvasItems((prev) => [
      ...prev.slice(0, dropIndex),
      item,
      ...prev.slice(dropIndex),
    ]);
    setSelectedIndex(dropIndex);
  };
  const handleSelect = (idx: number) => setSelectedIndex(idx);
  const handleDelete = () => {
    if (selectedIndex === null) return;
    setCanvasItems((prev) => prev.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* 상단 메뉴바 */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-200 rounded flex items-center justify-center font-bold text-purple-700 text-lg">
              💌
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              모두의 청첩장
            </span>
          </div>
          <nav className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-900 text-sm font-medium">
              템플릿
            </button>
            <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-sm font-medium flex items-center gap-1">
              AI 추천 <span className="ml-1 text-xs">🔒</span>
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-900 text-sm font-medium">
              미리보기
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-900 text-sm font-medium">
              저장
            </button>
            <button className="px-3 py-1 rounded bg-purple-600 text-white text-sm font-medium">
              공유하기
            </button>
          </nav>
        </header>
        {/* 본문 3분할 */}
        <div className="flex flex-1 min-h-0">
          <ComponentPanel components={COMPONENTS} />
          <main className="flex-1 flex items-center justify-center bg-gray-100 min-h-0">
            <div className="relative flex flex-col items-center">
              <MobileCanvas
                canvasItems={canvasItems}
                onDrop={handleDrop}
                onSelect={handleSelect}
                selectedIndex={selectedIndex}
              />
            </div>
          </main>
          {/* 우측: 속성 패널 (3분할 고정) */}
          <aside className="w-80 bg-white border-l flex flex-col p-6 min-h-0">
            <div className="font-semibold text-gray-900 mb-4">속성</div>
            {selectedIndex !== null && canvasItems[selectedIndex] ? (
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1">선택된 요소</div>
                <div className="flex items-center gap-2 text-base font-medium text-gray-800">
                  {canvasItems[selectedIndex].label}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm mb-4">
                <span>
                  요소를 선택하여
                  <br />
                  편집 옵션이 나타납니다
                </span>
              </div>
            )}
            <div className="flex-1" />
            {selectedIndex !== null && (
              <button
                onClick={handleDelete}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" /> 요소 삭제
              </button>
            )}
          </aside>
        </div>
      </div>
    </DndProvider>
  );
}
