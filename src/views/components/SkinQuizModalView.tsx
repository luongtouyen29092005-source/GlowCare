import React, { useState, useEffect } from 'react';
import { skinQuizModel, QUIZ_QUESTIONS } from '../../models/SkinQuizModel';
import { skinQuizController } from '../../controllers/SkinQuizController';
import { SkinQuizResult, Product } from '../../types';
import { 
  X, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Sun, 
  Moon, 
  ShoppingBag, 
  RotateCcw,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { productController } from '../../controllers/ProductController';

export const SkinQuizModalView: React.FC = () => {
  const [quizState, setQuizState] = useState<{
    step: number;
    isOpen: boolean;
    result: SkinQuizResult | null;
  }>({
    step: 0,
    isOpen: false,
    result: null,
  });

  useEffect(() => {
    return skinQuizModel.subscribe(setQuizState);
  }, []);

  if (!quizState.isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[quizState.step];
  const isFinished = !!quizState.result;

  return (
    <div
      id="skin-quiz-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6"
      onClick={() => skinQuizController.closeQuiz()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                Chẩn Đoán Tình Trạng Da & Thiết Lập Routine
              </h2>
              <p className="text-[11px] text-stone-500">
                Tư vấn chuẩn khoa học dựa trên thuật toán phân loại biểu bì
              </p>
            </div>
          </div>
          <button
            id="close-quiz-btn"
            onClick={() => skinQuizController.closeQuiz()}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Đóng bài trắc nghiệm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!isFinished ? (
            /* Questions Flow */
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-stone-500">
                  <span>Câu hỏi {quizState.step + 1} / {QUIZ_QUESTIONS.length}</span>
                  <span>{Math.round(((quizState.step + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className="h-full bg-rose-600 transition-all duration-300"
                    style={{ width: `${((quizState.step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question text */}
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    id={`quiz-opt-${idx}`}
                    onClick={() => skinQuizController.selectOption(idx)}
                    className="w-full text-left p-4 rounded-2xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50/40 active:scale-[0.99] transition-all flex items-start gap-3 group"
                  >
                    <div className="w-6 h-6 rounded-full border border-stone-300 group-hover:border-rose-500 flex items-center justify-center text-xs font-bold text-stone-400 group-hover:text-rose-600 group-hover:bg-rose-50 flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-rose-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Previous button */}
              {quizState.step > 0 && (
                <button
                  onClick={() => skinQuizController.goBack()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại câu trước</span>
                </button>
              )}
            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-stone-50 to-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-white px-2.5 py-1 rounded-full border border-rose-200">
                    Kết quả chẩn đoán
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mt-2">
                    Làn da của bạn: <span className="text-rose-700">{quizState.result.primarySkinType}</span>
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Vấn đề ưu tiên cải thiện: <b>{quizState.result.concerns.join(', ')}</b>
                  </p>
                </div>

                <button
                  onClick={() => skinQuizController.restartQuiz()}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại trắc nghiệm</span>
                </button>
              </div>

              {/* Morning Routine */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Chu Trình Buổi Sáng (Bảo Vệ & Cấp Nước)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {quizState.result.recommendedRoutine.morning.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        skinQuizController.closeQuiz();
                        productController.openProductDetail(p.id);
                      }}
                      className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 hover:border-rose-300 transition-colors cursor-pointer group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-rose-700">Bước {idx + 1}</span>
                      <h5 className="text-[11px] font-semibold text-stone-900 line-clamp-2 leading-tight">
                        {p.name}
                      </h5>
                      <span className="text-xs font-bold text-stone-900 mt-1 block">
                        {p.price.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evening Routine */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Chu Trình Buổi Tối (Làm Sạch Sâu & Phục Hồi Tái Tạo)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {quizState.result.recommendedRoutine.evening.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        skinQuizController.closeQuiz();
                        productController.openProductDetail(p.id);
                      }}
                      className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 hover:border-rose-300 transition-colors cursor-pointer group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700">Bước {idx + 1}</span>
                      <h5 className="text-[11px] font-semibold text-stone-900 line-clamp-2 leading-tight">
                        {p.name}
                      </h5>
                      <span className="text-xs font-bold text-stone-900 mt-1 block">
                        {p.price.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Tips */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                  <span>Lời khuyên của chuyên gia da liễu:</span>
                </div>
                <ul className="space-y-1 text-stone-700">
                  {quizState.result.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add All Routine to Cart CTA */}
              <div className="pt-2">
                <button
                  id="add-full-routine-btn"
                  onClick={() => {
                    const allRoutineProducts: Product[] = [
                      ...quizState.result!.recommendedRoutine.morning,
                      ...quizState.result!.recommendedRoutine.evening,
                    ];
                    // Unique products
                    const unique = Array.from(new Map(allRoutineProducts.map((p) => [p.id, p])).values());
                    skinQuizController.addFullRoutine(unique);
                  }}
                  className="w-full py-4 px-6 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5 text-rose-300" />
                  <span>Thêm trọn bộ Routine vào giỏ hàng (Ưu đãi Combo)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
