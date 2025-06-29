"use client";
import React, { useEffect, useState } from "react";
import { CanvasItem } from "./CanvasComponent";
import { X, Share2, Download } from "lucide-react";

interface PreviewModeProps {
  canvasItems: CanvasItem[];
  onClose: () => void;
}

export default function PreviewMode({ canvasItems, onClose }: PreviewModeProps) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 이미지 로딩 상태 관리
  useEffect(() => {
    const imageItems = canvasItems.filter((item) => item.type === "image" && item.imageUrl);
    if (imageItems.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
  }, [canvasItems]);

  // 카운트다운 계산
  useEffect(() => {
    const countdownItem = canvasItems.find(item => item.type === "countdown");
    if (!countdownItem) return;

    const targetDate = countdownItem.content ? new Date(countdownItem.content) : new Date('2024-12-25T14:00:00');
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, [canvasItems]);

  const handleImageLoad = () => {
    const imageItems = canvasItems.filter((item) => item.type === "image" && item.imageUrl);
    if (imageItems.length > 0) {
      if (imageItems.every((img) => {
        const el = document.getElementById(`preview-img-${img.id}`) as HTMLImageElement;
        return el && el.complete;
      })) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const renderComponent = (item: CanvasItem) => {
    switch (item.type) {
      case "text":
        return (
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {item.content || "샘플 텍스트"}
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              여기에 텍스트 내용을 입력하세요
            </p>
          </div>
        );
      
      case "image":
        const sizeClass = item.imageSize === "large"
          ? "w-full h-72"
          : item.imageSize === "medium"
          ? "w-24 h-24 md:w-24 md:h-24" // 96x96
          : "w-12 h-12"; // 48x48
        return (
          <div className="text-center p-6">
            {item.imageUrl ? (
              <img
                id={`preview-img-${item.id}`}
                src={item.imageUrl}
                alt="업로드 이미지"
                className={`${sizeClass} object-cover rounded-xl mx-auto mb-4 border`}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className={`${sizeClass} bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-gray-400 text-sm">이미지</span>
              </div>
            )}
            {!item.imageUrl && (
              <p className="text-sm text-gray-600">이미지를 추가하세요</p>
            )}
          </div>
        );
      
      case "date":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mx-4">
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {item.content || "2024년 12월 25일"}
            </div>
            <p className="text-lg text-blue-600">오후 2시</p>
          </div>
        );
      
      case "location":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl mx-4">
            <div className="text-xl font-semibold text-green-800 mb-2">
              {item.content || "예식장 이름"}
            </div>
            <p className="text-base text-green-600">서울시 강남구...</p>
          </div>
        );
      
      case "couple":
        const groomName = item.props?.groomName || "김철수";
        const brideName = item.props?.brideName || "이영희";
        const groomParents = item.props?.groomParents || "김부모님";
        const brideParents = item.props?.brideParents || "이부모님";
        const groomPhone = item.props?.groomPhone || "010-1234-5678";
        const bridePhone = item.props?.bridePhone || "010-9876-5432";
        
        return (
          <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-pink-800 mb-2">신랑 & 신부</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* 신랑 정보 */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="text-base font-semibold text-blue-800 mb-2 text-center">신랑</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름:</span>
                    <span className="font-medium">{groomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">혼주:</span>
                    <span className="font-medium">{groomParents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연락처:</span>
                    <span className="font-medium">{groomPhone}</span>
                  </div>
                </div>
              </div>
              
              {/* 신부 정보 */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="text-base font-semibold text-pink-800 mb-2 text-center">신부</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름:</span>
                    <span className="font-medium">{brideName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">혼주:</span>
                    <span className="font-medium">{brideParents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연락처:</span>
                    <span className="font-medium">{bridePhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "gallery":
        const cols = item.galleryCols || 2;
        const maxSlots = item.galleryImages?.length || 4;
        const slots = Array.from({ length: maxSlots }, (_, i) => item.galleryImages?.[i] || null);
        const aspectRatioStyle = { aspectRatio: (item.galleryAspectRatio || '3/4').replace('/', ' / ') };
        return (
          <div className="p-6">
            <div className={`grid grid-cols-${cols} gap-2`}>
              {slots.map((img, i) => (
                <div
                  key={i}
                  className="w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative"
                  style={aspectRatioStyle}
                >
                  {img && img.url ? (
                    <img
                      src={img.url}
                      alt="갤러리"
                      className={`w-full h-full object-cover bg-white object-${item.galleryObjectPosition || 'center'}`}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">사진 {i + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case "video":
        return (
          <div className="text-center p-6">
            <div className="w-full h-32 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-sm">동영상</span>
            </div>
            <p className="text-sm text-gray-600">동영상을 추가하세요</p>
          </div>
        );
      
      case "countdown":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mx-4">
            <div className="text-4xl font-bold text-purple-800 mb-2">
              D-{countdown.days}
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="bg-white rounded p-2">
                <div className="font-bold text-purple-600">{countdown.days}</div>
                <div className="text-xs text-gray-500">일</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-bold text-purple-600">{countdown.hours}</div>
                <div className="text-xs text-gray-500">시</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-bold text-purple-600">{countdown.minutes}</div>
                <div className="text-xs text-gray-500">분</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-bold text-purple-600">{countdown.seconds}</div>
                <div className="text-xs text-gray-500">초</div>
              </div>
            </div>
            <p className="text-lg text-purple-600 mt-3">결혼식까지</p>
          </div>
        );
      
      case "guestbook":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl mx-4">
            <div className="text-2xl font-semibold text-yellow-800 mb-2">방명록</div>
            <p className="text-base text-yellow-600">축하 메시지를 남겨주세요</p>
          </div>
        );
      
      case "timeline":
        return (
          <div className="p-6">
            <div className="space-y-4">
              {["첫 만남", "연애", "프로포즈", "결혼"].map((event, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-base text-gray-700">{event}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "account":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mx-4">
            <div className="text-xl font-semibold text-gray-800 mb-2">계좌정보</div>
            <p className="text-base text-gray-600">축의금 계좌번호</p>
          </div>
        );
      
      case "background":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl mx-4">
            <p className="text-base text-purple-600">배경 스타일</p>
          </div>
        );
      
      case "divider":
        return (
          <div className="p-6">
            <hr className="border-t-2 border-gray-300" />
          </div>
        );
      
      default:
        return (
          <div className="text-center p-6">
            <span className="text-base text-gray-600">{item.label}</span>
          </div>
        );
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40" style={{ pointerEvents: 'all' }}>
          <div className="absolute inset-0 bg-black bg-opacity-40" style={{ pointerEvents: 'all' }} />
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin z-10" />
        </div>
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* 미리보기 헤더 */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">미리보기</h2>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* 모바일 프리뷰 */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="w-[340px] min-h-[700px] bg-gradient-to-b from-orange-50 to-white mx-auto my-4 rounded-[40px] border-4 border-gray-300 shadow-2xl flex flex-col">
              {/* 상단 바(모바일) */}
              <div className="h-8 flex items-center justify-between px-6 text-xs text-gray-500">
                <span>9:41</span>
                <span className="flex gap-1 items-center">
                  <span className="w-3 h-3 bg-green-200 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                </span>
              </div>
              
              {/* 콘텐츠 */}
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                {canvasItems.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <p className="text-lg">아직 구성 요소가 없습니다</p>
                    <p className="text-sm mt-2">편집 모드에서 요소를 추가해보세요</p>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    {canvasItems.map((item) => (
                      <div key={item.id}>
                        {renderComponent(item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 