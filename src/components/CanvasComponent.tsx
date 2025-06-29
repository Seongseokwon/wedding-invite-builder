"use client";
import React, { useRef, useEffect, useState } from "react";
import { Image as ImageIcon, Calendar, MapPin, Images, Video, Timer, BookText, CreditCard, Paintbrush, Users } from "lucide-react";

export interface CanvasItem {
  id: string;
  type: string;
  label: string;
  content?: string;
  imageUrl?: string;
  imageSize?: "small" | "medium" | "large";
  galleryImages?: { url: string; caption?: string; aspectRatio?: string }[];
  galleryCols?: 2 | 3;
  galleryThumbSize?: "small" | "medium" | "large";
  props?: Record<string, string | number | boolean>;
  galleryObjectPosition?: string;
  galleryAspectRatio?: string;
}

interface CanvasComponentProps {
  item: CanvasItem;
  isSelected: boolean;
  onClick: () => void;
}

export default function CanvasComponent({ item, isSelected, onClick }: CanvasComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!item.imageUrl && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // PropertyPanel에서 삭제 시 file input 초기화
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.id === item.id && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    window.addEventListener("canvas-image-input-clear", handler);
    return () => window.removeEventListener("canvas-image-input-clear", handler);
  }, [item.imageUrl, item.id]);

  // 카운트다운 기능
  useEffect(() => {
    if (item.type !== "countdown") return;
    
    const targetDate = item.content ? new Date(item.content) : new Date('2024-12-25T14:00:00');
    
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
  }, [item.content, item.type]);

  const handleThumbClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.imageUrl && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // 커스텀 이벤트로 부모에서 상태 업데이트
      const event = new CustomEvent("canvas-image-upload-single", { detail: { id: item.id, url: ev.target?.result } });
      window.dispatchEvent(event);
    };
    reader.readAsDataURL(file);
  };

  const renderComponent = () => {
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
          ? "w-24 h-24 md:w-24 md:h-24"
          : "w-12 h-12";
        return (
          <div className="text-center p-6" onClick={onClick}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt="업로드 이미지"
                className={`${sizeClass} object-cover rounded-xl mx-auto mb-4 border`}
              />
            ) : (
              <div
                className={`${sizeClass} bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center cursor-pointer hover:bg-gray-300`}
                onClick={handleThumbClick}
              >
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            {!item.imageUrl && (
              <p className="text-sm text-gray-600">이미지를 추가하세요</p>
            )}
          </div>
        );
      
      case "date":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              {item.content || "2024년 12월 25일"}
            </h3>
            <p className="text-lg text-blue-600">오후 2시</p>
          </div>
        );
      
      case "location":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <MapPin className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              {item.content || "예식장 이름"}
            </h3>
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
          <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
            <div className="text-center mb-6">
              <Users className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-pink-800 mb-4">신랑 & 신부</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 신랑 정보 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-lg font-semibold text-blue-800 mb-3 text-center">신랑</h4>
                <div className="space-y-2 text-sm">
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
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-lg font-semibold text-pink-800 mb-3 text-center">신부</h4>
                <div className="space-y-2 text-sm">
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
        const thumbSize = item.galleryThumbSize || "medium";
        const thumbClass = thumbSize === "large"
          ? "h-32"
          : thumbSize === "small"
          ? "h-16"
          : "h-24";
        
        // 이미지 개수에 따라 슬롯 생성 (최소 4개, 최대 12개)
        const maxSlots = item.galleryImages?.length || 4;
        const slots = Array.from({ length: maxSlots }, (_, i) => item.galleryImages?.[i] || null);
        return (
          <div className="p-6">
            <div className={`grid grid-cols-${cols} gap-2`}>
              {slots.map((img, i) => {
                const slotAspect = img?.aspectRatio || item.galleryAspectRatio || '3/4';
                const aspectRatioStyle = { aspectRatio: slotAspect.replace('/', ' / ') };
                return (
                  <div
                    key={i}
                    className={`w-full ${thumbClass} bg-gray-200 rounded flex items-center justify-center overflow-hidden relative`}
                    style={aspectRatioStyle}
                  >
                    {img && img.url ? (
                      <img 
                        src={img.url} 
                        alt="갤러리" 
                        className={`w-full h-full object-cover bg-white object-${item.galleryObjectPosition || 'center'}`}
                      />
                    ) : (
                      <Images className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-gray-600 mt-3">갤러리 ({maxSlots}장)</p>
          </div>
        );
      
      case "video":
        return (
          <div className="text-center p-6">
            <div className="w-full h-32 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">동영상을 추가하세요</p>
          </div>
        );
      
      case "countdown":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <Timer className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-800 mb-2">
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
          <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <BookText className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-semibold text-yellow-800 mb-2">방명록</h3>
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
          <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
            <CreditCard className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">계좌정보</h3>
            <p className="text-base text-gray-600">축의금 계좌번호</p>
          </div>
        );
      
      case "background":
        return (
          <div className="text-center p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
            <Paintbrush className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-base text-purple-600">배경 스타일</p>
          </div>
        );
      
      case "divider":
        return (
          <div className="p-6">
            <hr className="border-t-2 border-gray-300" />
            <p className="text-center text-sm text-gray-500 mt-3">구분선</p>
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
    <div
      onClick={onClick}
      className={`w-full bg-white border rounded-xl shadow-sm transition-all duration-150 cursor-pointer hover:shadow-md ${
        isSelected
          ? "border-purple-500 ring-2 ring-purple-200 shadow-md"
          : "border-gray-200"
      }`}
    >
      {renderComponent()}
    </div>
  );
} 