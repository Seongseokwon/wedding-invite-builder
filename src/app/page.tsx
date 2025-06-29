"use client";
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ComponentPanel from "../components/ComponentPanel";
import Canvas from "../components/Canvas";
import PropertyPanel from "../components/PropertyPanel";
import PreviewMode from "../components/PreviewMode";
import { CanvasItem } from "../components/CanvasComponent";
import { useLocalStorage } from "../hooks/useLocalStorage";
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
  X,
  Users,
} from "lucide-react";

// 템플릿 데이터
const TEMPLATES = [
  {
    id: "classic",
    name: "클래식",
    description: "전통적인 스타일의 청첩장",
    preview: "💒",
    items: [
      { id: "text-1", type: "text", label: "텍스트", content: "김철수 & 이영희" },
      { id: "text-2", type: "text", label: "텍스트", content: "결혼합니다" },
      { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
      { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
      { id: "location-1", type: "location", label: "위치", content: "그랜드 호텔" },
      { id: "divider-1", type: "divider", label: "구분선" },
      { id: "account-1", type: "account", label: "계좌정보", content: "축의금 계좌번호" },
    ]
  },
  {
    id: "modern",
    name: "모던",
    description: "현대적인 디자인의 청첩장",
    preview: "💕",
    items: [
      { id: "text-1", type: "text", label: "텍스트", content: "우리의 새로운 시작" },
      { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
      { id: "countdown-1", type: "countdown", label: "카운트다운", content: "2024-12-25" },
      { id: "image-1", type: "image", label: "이미지" },
      { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
      { id: "location-1", type: "location", label: "위치", content: "모던 웨딩홀" },
      { id: "gallery-1", type: "gallery", label: "갤러리", galleryImages: Array(6).fill({ url: "" }), galleryCols: 3 },
    ]
  },
  {
    id: "romantic",
    name: "로맨틱",
    description: "로맨틱한 분위기의 청첩장",
    preview: "🌹",
    items: [
      { id: "text-1", type: "text", label: "텍스트", content: "사랑하는 우리가" },
      { id: "text-2", type: "text", label: "텍스트", content: "함께하는 날" },
      { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
      { id: "timeline-1", type: "timeline", label: "타임라인" },
      { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
      { id: "location-1", type: "location", label: "위치", content: "로맨틱 가든" },
      { id: "guestbook-1", type: "guestbook", label: "방명록" },
    ]
  },
  {
    id: "minimal",
    name: "미니멀",
    description: "심플하고 깔끔한 청첩장",
    preview: "✨",
    items: [
      { id: "text-1", type: "text", label: "텍스트", content: "김철수 & 이영희" },
      { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
      { id: "divider-1", type: "divider", label: "구분선" },
      { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
      { id: "location-1", type: "location", label: "위치", content: "미니멀 스페이스" },
    ]
  }
];

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
    type: "couple",
    label: "신랑/신부",
    icon: <Users className="text-pink-500 w-6 h-6" />,
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
  const [canvasItems, setCanvasItems] = useLocalStorage<CanvasItem[]>("wedding-invite-items", []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);

  // URL에서 데이터 로드
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData && canvasItems.length === 0) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(sharedData));
        setCanvasItems(decodedData);
      } catch (error) {
        console.error('공유 데이터 로드 실패:', error);
      }
    }
  }, [canvasItems.length, setCanvasItems]);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCanvasItems((prev) => {
        const lastIdx = prev.length - 1;
        if (lastIdx < 0) return prev;
        const last = prev[lastIdx];
        if (last.type !== "image") return prev;
        return prev.map((item, idx) =>
          idx === lastIdx ? { ...item, imageUrl: customEvent.detail as string } : item
        );
      });
    };
    window.addEventListener("canvas-image-upload", handler);

    // 개별 이미지 요소에만 imageUrl 할당
    const singleHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCanvasItems((prev) =>
        prev.map((item) =>
          item.id === customEvent.detail.id
            ? { ...item, imageUrl: customEvent.detail.url as string }
            : item
        )
      );
    };
    window.addEventListener("canvas-image-upload-single", singleHandler);

    return () => {
      window.removeEventListener("canvas-image-upload", handler);
      window.removeEventListener("canvas-image-upload-single", singleHandler);
    };
  }, [setCanvasItems]);

  const handleDrop = (
    item: { type: string; label: string },
    dropIndex: number
  ) => {
    const newItem: CanvasItem = {
      id: `${item.type}-${Date.now()}-${Math.random()}`,
      type: item.type,
      label: item.label,
    };
    
    setCanvasItems((prev) => [
      ...prev.slice(0, dropIndex),
      newItem,
      ...prev.slice(dropIndex),
    ]);
    setSelectedIndex(dropIndex);
  };
  
  const handleSelect = (idx: number) => setSelectedIndex(idx);
  
  const handleUpdateItem = (updatedItem: CanvasItem) => {
    setCanvasItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };
  
  const handleDelete = () => {
    if (selectedIndex === null) return;
    setCanvasItems((prev) => prev.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(null);
  };

  const handleClearAll = () => {
    setCanvasItems([]);
    setSelectedIndex(null);
  };

  const selectedItem = selectedIndex !== null ? canvasItems[selectedIndex] : null;

  // 템플릿 적용 함수
  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    const newItems: CanvasItem[] = template.items.map(item => ({
      ...item,
      id: `${item.type}-${Date.now()}-${Math.random()}`,
      galleryCols: item.galleryCols as 2 | 3 | undefined
    }));
    setCanvasItems(newItems);
    setSelectedIndex(null);
    setShowTemplates(false);
  };

  // AI 추천 시스템
  const AI_RECOMMENDATIONS = {
    classic: {
      name: "클래식한 결혼식",
      description: "전통적이고 우아한 분위기",
      items: [
        { id: "text-1", type: "text", label: "텍스트", content: "김철수 & 이영희" },
        { id: "text-2", type: "text", label: "텍스트", content: "결혼합니다" },
        { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
        { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
        { id: "location-1", type: "location", label: "위치", content: "그랜드 호텔" },
        { id: "divider-1", type: "divider", label: "구분선" },
        { id: "account-1", type: "account", label: "계좌정보", content: "축의금 계좌번호" },
      ]
    },
    modern: {
      name: "모던한 결혼식",
      description: "현대적이고 세련된 분위기",
      items: [
        { id: "text-1", type: "text", label: "텍스트", content: "우리의 새로운 시작" },
        { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
        { id: "countdown-1", type: "countdown", label: "카운트다운", content: "2024-12-25" },
        { id: "image-1", type: "image", label: "이미지" },
        { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
        { id: "location-1", type: "location", label: "위치", content: "모던 웨딩홀" },
        { id: "gallery-1", type: "gallery", label: "갤러리", galleryImages: Array(6).fill({ url: "" }), galleryCols: 3 },
      ]
    },
    outdoor: {
      name: "야외 결혼식",
      description: "자연스럽고 로맨틱한 분위기",
      items: [
        { id: "text-1", type: "text", label: "텍스트", content: "자연과 함께하는 우리의 결혼식" },
        { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
        { id: "image-1", type: "image", label: "이미지" },
        { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
        { id: "location-1", type: "location", label: "위치", content: "가든 웨딩" },
        { id: "countdown-1", type: "countdown", label: "카운트다운", content: "2024-12-25" },
        { id: "guestbook-1", type: "guestbook", label: "방명록" },
      ]
    },
    intimate: {
      name: "소규모 결혼식",
      description: "친근하고 따뜻한 분위기",
      items: [
        { id: "text-1", type: "text", label: "텍스트", content: "소중한 분들과 함께하는 우리의 결혼식" },
        { id: "couple-1", type: "couple", label: "신랑/신부", props: { groomName: "김철수", brideName: "이영희", groomParents: "김부모님", brideParents: "이부모님", groomPhone: "010-1234-5678", bridePhone: "010-9876-5432" } },
        { id: "timeline-1", type: "timeline", label: "타임라인" },
        { id: "date-1", type: "date", label: "일정", content: "2024-12-25" },
        { id: "location-1", type: "location", label: "위치", content: "인티밋 스페이스" },
        { id: "gallery-1", type: "gallery", label: "갤러리", galleryImages: Array(4).fill({ url: "" }), galleryCols: 2 },
        { id: "guestbook-1", type: "guestbook", label: "방명록" },
      ]
    }
  };

  const applyAIRecommendation = (recommendation: typeof AI_RECOMMENDATIONS[keyof typeof AI_RECOMMENDATIONS]) => {
    const newItems: CanvasItem[] = recommendation.items.map(item => {
      const baseItem = {
        ...item,
        id: `${item.type}-${Date.now()}-${Math.random()}`
      };
      
      if (item.type === 'gallery' && 'galleryCols' in item) {
        return {
          ...baseItem,
          galleryCols: item.galleryCols as 2 | 3
        };
      }
      
      return baseItem;
    });
    setCanvasItems(newItems);
    setSelectedIndex(null);
    setShowAIRecommendation(false);
  };

  // 공유하기 함수
  const handleShare = () => {
    if (canvasItems.length === 0) {
      alert('공유할 청첩장이 없습니다. 먼저 청첩장을 만들어보세요!');
      return;
    }
    setShowShareModal(true);
  };

  const generateShareUrl = () => {
    const data = encodeURIComponent(JSON.stringify(canvasItems));
    return `${window.location.origin}?data=${data}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL이 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      // 폴백: 텍스트 선택
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL이 클립보드에 복사되었습니다!');
    }
  };

  // 청첩장 배포 기능
  const generateWeddingInviteHTML = () => {
    const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>청첩장</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen gradient-bg py-8">
        <div class="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div class="p-8">
                ${canvasItems.map(item => {
                  switch (item.type) {
                    case 'text':
                      return `<div class="text-center mb-8">
                        <h1 class="text-2xl font-bold text-gray-800 mb-2">${item.content || '샘플 텍스트'}</h1>
                        <p class="text-gray-600">여기에 텍스트 내용을 입력하세요</p>
                      </div>`;
                    case 'date':
                      return `<div class="text-center mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <div class="text-3xl font-bold text-blue-800 mb-2">${item.content || '2024년 12월 25일'}</div>
                        <p class="text-lg text-blue-600">오후 2시</p>
                      </div>`;
                    case 'location':
                      return `<div class="text-center mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                        <div class="text-xl font-semibold text-green-800 mb-2">${item.content || '예식장 이름'}</div>
                        <p class="text-base text-green-600">서울시 강남구...</p>
                      </div>`;
                    case 'countdown':
                      return `<div class="text-center mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                        <div class="text-4xl font-bold text-purple-800 mb-2">D-30</div>
                        <p class="text-lg text-purple-600">결혼식까지</p>
                      </div>`;
                    case 'image':
                      return item.imageUrl ? `<div class="text-center mb-8">
                        <img src="${item.imageUrl}" alt="청첩장 이미지" class="w-full h-64 object-cover rounded-xl mx-auto mb-4">
                      </div>` : `<div class="text-center mb-8">
                        <div class="w-full h-64 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                          <span class="text-gray-400">이미지</span>
                        </div>
                      </div>`;
                    case 'gallery':
                      const cols = item.galleryCols || 2;
                      const images = item.galleryImages || [];
                      return `<div class="mb-8">
                        <div class="grid grid-cols-${cols} gap-2">
                          ${Array.from({ length: Math.max(4, images.length) }, (_, i) => 
                            images[i]?.url ? 
                              `<img src="${images[i].url}" alt="갤러리" class="w-full h-24 object-cover rounded-lg">` :
                              `<div class="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span class="text-gray-400 text-sm">사진 ${i + 1}</span>
                              </div>`
                          ).join('')}
                        </div>
                      </div>`;
                    case 'guestbook':
                      return `<div class="text-center mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                        <div class="text-2xl font-semibold text-yellow-800 mb-2">방명록</div>
                        <p class="text-base text-yellow-600">축하 메시지를 남겨주세요</p>
                      </div>`;
                    case 'timeline':
                      return `<div class="mb-8">
                        <div class="space-y-4">
                          ${['첫 만남', '연애', '프로포즈', '결혼'].map(event => 
                            `<div class="flex items-center gap-3">
                              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span class="text-base text-gray-700">${event}</span>
                            </div>`
                          ).join('')}
                        </div>
                      </div>`;
                    case 'account':
                      return `<div class="text-center mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                        <div class="text-xl font-semibold text-gray-800 mb-2">계좌정보</div>
                        <p class="text-base text-gray-600">축의금 계좌번호</p>
                      </div>`;
                    case 'divider':
                      return `<hr class="border-t-2 border-gray-300 my-8">`;
                    case 'couple':
                      const groomName = item.props?.groomName || "김철수";
                      const brideName = item.props?.brideName || "이영희";
                      const groomParents = item.props?.groomParents || "김부모님";
                      const brideParents = item.props?.brideParents || "이부모님";
                      const groomPhone = item.props?.groomPhone || "010-1234-5678";
                      const bridePhone = item.props?.bridePhone || "010-9876-5432";
                      return `<div class="mb-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
                        <div class="text-center mb-4">
                          <h3 class="text-lg font-semibold text-pink-800 mb-2">신랑 & 신부</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white rounded-lg p-4 shadow-sm">
                            <h4 class="text-base font-semibold text-blue-800 mb-2 text-center">신랑</h4>
                            <div class="space-y-1 text-sm">
                              <div class="flex justify-between">
                                <span class="text-gray-600">이름:</span>
                                <span class="font-medium">${groomName}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-gray-600">혼주:</span>
                                <span class="font-medium">${groomParents}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-gray-600">연락처:</span>
                                <span class="font-medium">${groomPhone}</span>
                              </div>
                            </div>
                          </div>
                          <div class="bg-white rounded-lg p-4 shadow-sm">
                            <h4 class="text-base font-semibold text-pink-800 mb-2 text-center">신부</h4>
                            <div class="space-y-1 text-sm">
                              <div class="flex justify-between">
                                <span class="text-gray-600">이름:</span>
                                <span class="font-medium">${brideName}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-gray-600">혼주:</span>
                                <span class="font-medium">${brideParents}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-gray-600">연락처:</span>
                                <span class="font-medium">${bridePhone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
                    default:
                      return `<div class="text-center mb-8">
                        <span class="text-base text-gray-600">${item.label}</span>
                      </div>`;
                  }
                }).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;
    return html;
  };

  const downloadWeddingInvite = () => {
    const html = generateWeddingInviteHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '청첩장.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* 상단 메뉴바 */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-200 rounded flex items-center justify-center font-bold text-purple-700 text-lg">
              💌
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              모두의 청첩장
            </span>
          </div>
          <nav className="flex gap-2">
            <button 
              onClick={() => setShowTemplates(true)}
              className="px-3 py-1 rounded bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200"
            >
              템플릿
            </button>
            <button 
              onClick={() => setShowAIRecommendation(true)}
              className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-sm font-medium flex items-center gap-1 hover:bg-yellow-200"
            >
              AI 추천
            </button>
            <button 
              onClick={() => setIsPreviewMode(true)}
              className="px-3 py-1 rounded bg-blue-100 text-blue-800 text-sm font-medium hover:bg-blue-200"
            >
              미리보기
            </button>
            <button 
              onClick={handleClearAll}
              className="px-3 py-1 rounded bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
            >
              초기화
            </button>
            <button 
              onClick={handleShare}
              className="px-3 py-1 rounded bg-purple-600 text-white text-sm font-medium"
            >
              공유하기
            </button>
            <button 
              onClick={() => setShowDeployModal(true)}
              className="px-3 py-1 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
            >
              배포하기
            </button>
          </nav>
        </header>
        
        {/* 본문 3분할 */}
        <div className="flex flex-1 min-h-0">
          {/* 왼쪽: 구성 요소 패널 */}
          <div className="w-64 bg-white border-r flex-shrink-0">
            <ComponentPanel components={COMPONENTS} />
          </div>
          
          {/* 중앙: 캔버스 */}
          <main className="flex-1 flex items-center justify-center bg-gray-100 p-6 overflow-y-auto">
            <Canvas
              canvasItems={canvasItems}
              onDrop={handleDrop}
              onSelect={handleSelect}
              selectedIndex={selectedIndex}
            />
          </main>
          
          {/* 우측: 속성 패널 */}
          <div className="w-80 bg-white border-l flex-shrink-0">
            <PropertyPanel
              selectedItem={selectedItem}
              onUpdateItem={handleUpdateItem}
              onDelete={handleDelete}
            />
          </div>
        </div>
        
        {/* 미리보기 모드 */}
        {isPreviewMode && (
          <PreviewMode
            canvasItems={canvasItems}
            onClose={() => setIsPreviewMode(false)}
          />
        )}

        {/* 템플릿 선택 모달 */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">템플릿 선택</h2>
                <button 
                  onClick={() => setShowTemplates(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {TEMPLATES.map((template) => (
                    <div 
                      key={template.id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="text-4xl mb-4 text-center">{template.preview}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        {template.items.length}개 요소 포함
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 공유하기 모달 */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">청첩장 공유</h2>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">공유 URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generateShareUrl()}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button 
                      onClick={() => copyToClipboard(generateShareUrl())}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                    >
                      복사
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• 이 URL을 다른 사람에게 보내면 동일한 청첩장을 볼 수 있습니다</p>
                  <p>• 청첩장을 수정하면 URL도 변경됩니다</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI 추천 모달 */}
        {showAIRecommendation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">AI 청첩장 추천</h2>
                <button 
                  onClick={() => setShowAIRecommendation(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">어떤 스타일의 결혼식을 계획하고 계신가요?</h3>
                  <p className="text-gray-600">AI가 결혼식 스타일에 맞는 최적의 청첩장 구성을 추천해드립니다.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(AI_RECOMMENDATIONS).map(([key, recommendation]) => (
                    <div 
                      key={key}
                      className="border border-gray-200 rounded-xl p-6 hover:border-yellow-300 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => applyAIRecommendation(recommendation)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                          {key === 'classic' && '💒'}
                          {key === 'modern' && '💕'}
                          {key === 'outdoor' && '🌿'}
                          {key === 'intimate' && '💝'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{recommendation.name}</h3>
                          <p className="text-sm text-gray-600">{recommendation.description}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {recommendation.items.length}개 요소로 구성된 추천 청첩장
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 배포 모달 */}
        {showDeployModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">청첩장 배포</h2>
                <button 
                  onClick={() => setShowDeployModal(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">청첩장을 다운로드하세요</h3>
                  <p className="text-gray-600 text-sm">
                    완성된 청첩장을 HTML 파일로 다운로드하여 웹사이트에 업로드하거나 이메일로 공유할 수 있습니다.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      downloadWeddingInvite();
                      setShowDeployModal(false);
                    }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    HTML 파일 다운로드
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    <p>• 다운로드된 파일을 웹 호스팅 서비스에 업로드하세요</p>
                    <p>• 네이버 클라우드, AWS S3, GitHub Pages 등을 사용할 수 있습니다</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
