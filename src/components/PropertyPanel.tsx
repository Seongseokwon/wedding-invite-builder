"use client";
import React from "react";
import { CanvasItem } from "./CanvasComponent";
import { Trash2, Image as ImageIcon } from "lucide-react";

interface PropertyPanelProps {
  selectedItem: CanvasItem | null;
  onUpdateItem: (updatedItem: CanvasItem) => void;
  onDelete: () => void;
}

export default function PropertyPanel({ selectedItem, onUpdateItem, onDelete }: PropertyPanelProps) {
  const handleContentChange = (content: string) => {
    if (!selectedItem) return;
    onUpdateItem({ ...selectedItem, content });
  };

  const handlePropsChange = (key: string, value: string) => {
    if (!selectedItem) return;
    onUpdateItem({ 
      ...selectedItem, 
      props: { 
        ...selectedItem.props, 
        [key]: value 
      } 
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedItem) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdateItem({ ...selectedItem, imageUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = () => {
    if (!selectedItem) return;
    onUpdateItem({ ...selectedItem, imageUrl: undefined });
    window.dispatchEvent(new CustomEvent("canvas-image-input-clear", { detail: { id: selectedItem.id } }));
  };

  const handleImageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedItem) return;
    onUpdateItem({ ...selectedItem, imageSize: e.target.value as "small" | "medium" | "large" });
  };

  const [galleryMaxCount, setGalleryMaxCount] = React.useState<number>(selectedItem?.galleryImages?.length || 4);
  React.useEffect(() => {
    if (selectedItem && selectedItem.galleryImages) {
      const currentLength = selectedItem.galleryImages.length;
      if (currentLength !== galleryMaxCount) {
        // 이미지 개수 맞추기
        const newImages = Array.from({ length: galleryMaxCount }, (_, i) => {
          if (i < currentLength) {
            return selectedItem.galleryImages![i];
          } else {
            return { url: "" };
          }
        });
        onUpdateItem({
          ...selectedItem,
          galleryImages: newImages,
          id: selectedItem.id,
          type: selectedItem.type,
          label: selectedItem.label,
        });
      }
    }
  }, [galleryMaxCount, selectedItem]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleGalleryMultiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedItem) return;
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // 최대 개수 체크
    const currentCount = selectedItem.galleryImages?.filter(img => img.url).length || 0;
    if (currentCount + files.length > galleryMaxCount) {
      alert(`최대 ${galleryMaxCount}장까지만 업로드할 수 있습니다. (현재 ${currentCount}장 + 추가 ${files.length}장)`);
      return;
    }
    
    // 파일들을 순차적으로 처리
    const processFiles = async () => {
      const newImages = [...(selectedItem.galleryImages || [])];
      let nextIndex = newImages.findIndex(img => !img.url);
      if (nextIndex === -1) nextIndex = newImages.length;
      
      for (let i = 0; i < files.length && nextIndex < galleryMaxCount; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        await new Promise<void>((resolve) => {
          reader.onload = (ev) => {
            newImages[nextIndex] = { url: ev.target?.result as string };
            nextIndex++;
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      
      onUpdateItem({
        ...selectedItem,
        galleryImages: newImages,
        id: selectedItem.id,
        type: selectedItem.type,
        label: selectedItem.label,
      });
    };
    
    processFiles();
  };
  const handleGalleryDelete = (idx: number) => {
    if (!selectedItem) return;
    const newImages = [...(selectedItem.galleryImages || [])];
    newImages[idx] = { url: "" };
    onUpdateItem({
      ...selectedItem,
      galleryImages: newImages,
      id: selectedItem.id,
      type: selectedItem.type,
      label: selectedItem.label,
    });
  };
  const handleGalleryThumbSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedItem) return;
    onUpdateItem({
      ...selectedItem,
      galleryThumbSize: e.target.value as "small" | "medium" | "large",
      id: selectedItem.id,
      type: selectedItem.type,
      label: selectedItem.label,
    });
  };
  const handleGalleryCols = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedItem) return;
    onUpdateItem({
      ...selectedItem,
      galleryCols: Number(e.target.value) as 2 | 3,
      id: selectedItem.id,
      type: selectedItem.type,
      label: selectedItem.label,
    });
  };

  const renderPropertyFields = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                텍스트 내용
              </label>
              <textarea
                value={selectedItem.content || ""}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                placeholder="텍스트를 입력하세요..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                텍스트 스타일
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  제목
                </button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  본문
                </button>
              </div>
            </div>
          </div>
        );

      case "date":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                날짜
              </label>
              <input
                type="date"
                value={selectedItem.content || ""}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                시간
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                장소명
              </label>
              <input
                type="text"
                value={selectedItem.content || ""}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="예식장 이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                주소
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="상세 주소를 입력하세요"
              />
            </div>
          </div>
        );

      case "couple":
        return (
          <div className="space-y-6">
            {/* 신랑 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-4">신랑 정보</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    신랑 이름
                  </label>
                  <input
                    type="text"
                    value={(selectedItem.props?.groomName as string) || ""}
                    onChange={(e) => handlePropsChange("groomName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="신랑 이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    신랑 혼주
                  </label>
                  <input
                    type="text"
                    value={(selectedItem.props?.groomParents as string) || ""}
                    onChange={(e) => handlePropsChange("groomParents", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="신랑 혼주를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    신랑 연락처
                  </label>
                  <input
                    type="tel"
                    value={(selectedItem.props?.groomPhone as string) || ""}
                    onChange={(e) => handlePropsChange("groomPhone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>
            </div>

            {/* 신부 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-pink-800 mb-4">신부 정보</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    신부 이름
                  </label>
                  <input
                    type="text"
                    value={(selectedItem.props?.brideName as string) || ""}
                    onChange={(e) => handlePropsChange("brideName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="신부 이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    신부 혼주
                  </label>
                  <input
                    type="text"
                    value={(selectedItem.props?.brideParents as string) || ""}
                    onChange={(e) => handlePropsChange("brideParents", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="신부 혼주를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    신부 연락처
                  </label>
                  <input
                    type="tel"
                    value={(selectedItem.props?.bridePhone as string) || ""}
                    onChange={(e) => handlePropsChange("bridePhone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="010-9876-5432"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                이미지 업로드
              </label>
              <div className="flex flex-col items-center gap-2">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt="업로드 이미지"
                    className="w-40 h-40 object-cover rounded-lg border mb-2"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {selectedItem.imageUrl && (
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="mt-2 px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs"
                  >
                    이미지 삭제
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                이미지 크기
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedItem.imageSize || "small"}
                onChange={handleImageSizeChange}
              >
                <option value="small">작게</option>
                <option value="medium">보통</option>
                <option value="large">크게</option>
              </select>
            </div>
          </div>
        );

      case "countdown":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                목표 날짜
              </label>
              <input
                type="date"
                value={selectedItem.content || ""}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                표시 형식
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>D-XX</option>
                <option>XX일 남음</option>
                <option>XX시간 XX분</option>
              </select>
            </div>
          </div>
        );

      case "gallery":
        if (!selectedItem) return null;
        const currentImageCount = selectedItem.galleryImages?.filter(img => img.url).length || 0;
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">이미지 개수</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={galleryMaxCount}
                onChange={e => setGalleryMaxCount(Number(e.target.value))}
              >
                {[4, 6, 8, 9, 12].map(n => (
                  <option key={n} value={n}>{n}장</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">이미지 업로드</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">
                    {currentImageCount} / {galleryMaxCount} 장 업로드됨
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={currentImageCount >= galleryMaxCount}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    이미지 추가
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleGalleryMultiUpload}
                  className="hidden"
                />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: galleryMaxCount }).map((_, idx) => (
                    <div key={idx} className="relative flex items-center gap-2">
                      {selectedItem.galleryImages && selectedItem.galleryImages[idx] && selectedItem.galleryImages[idx].url ? (
                        <>
                          <img 
                            src={selectedItem.galleryImages[idx].url} 
                            alt="갤러리" 
                            className="w-20 h-20 object-cover rounded border" 
                          />
                          <select
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={selectedItem.galleryImages[idx].aspectRatio || (selectedItem.galleryAspectRatio || "3/4")}
                            onChange={e => {
                              const newImages = [...selectedItem.galleryImages!];
                              newImages[idx] = {
                                ...newImages[idx],
                                aspectRatio: e.target.value
                              };
                              onUpdateItem({
                                ...selectedItem,
                                galleryImages: newImages,
                                id: selectedItem.id,
                                type: selectedItem.type,
                                label: selectedItem.label,
                              });
                            }}
                          >
                            <option value="1/1">1:1</option>
                            <option value="3/4">3:4</option>
                            <option value="2/3">2:3</option>
                            <option value="4/3">4:3</option>
                            <option value="16/9">16:9</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleGalleryDelete(idx)}
                            className="ml-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-500">빈 슬롯</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">썸네일 크기</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedItem.galleryThumbSize || "medium"}
                onChange={handleGalleryThumbSize}
              >
                <option value="small">작게</option>
                <option value="medium">보통</option>
                <option value="large">크게</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">열 수</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedItem.galleryCols || 2}
                onChange={handleGalleryCols}
              >
                <option value={2}>2열</option>
                <option value={3}>3열</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">이미지 위치</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedItem.galleryObjectPosition || "center"}
                onChange={e => onUpdateItem({
                  ...selectedItem,
                  galleryObjectPosition: e.target.value,
                  id: selectedItem.id,
                  type: selectedItem.type,
                  label: selectedItem.label,
                })}
              >
                <option value="top">상단</option>
                <option value="center">중앙</option>
                <option value="bottom">하단</option>
                <option value="left">좌측</option>
                <option value="right">우측</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">썸네일 비율</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedItem.galleryAspectRatio || "3/4"}
                onChange={e => onUpdateItem({
                  ...selectedItem,
                  galleryAspectRatio: e.target.value,
                  id: selectedItem.id,
                  type: selectedItem.type,
                  label: selectedItem.label,
                })}
              >
                <option value="1/1">정사각형 (1:1)</option>
                <option value="3/4">세로 (3:4)</option>
                <option value="2/3">세로 (2:3)</option>
                <option value="4/3">가로 (4:3)</option>
                <option value="16/9">와이드 (16:9)</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 text-sm">
            <p>이 요소의 편집 옵션이 곧 추가될 예정입니다.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-gray-50">
        <div className="font-semibold text-gray-900">속성</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {selectedItem ? (
          <div>
            <div className="mb-6">
              <div className="text-xs text-gray-400 mb-1">선택된 요소</div>
              <div className="flex items-center gap-2 text-base font-medium text-gray-800">
                {selectedItem.label}
              </div>
            </div>
            
            <div className="space-y-6">
              {renderPropertyFields()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
            <span>
              요소를 선택하여
              <br />
              편집 옵션이 나타납니다
            </span>
          </div>
        )}
      </div>
      
      {selectedItem && (
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> 요소 삭제
          </button>
        </div>
      )}
    </div>
  );
} 