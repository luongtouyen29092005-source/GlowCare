import { QuizQuestion, SkinType, SkinQuizResult, Product } from '../types';
import { productModel } from './ProductModel';
import { eventBus } from './EventBus';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Sau khi rửa mặt 30 phút mà không bôi bất kỳ sản phẩm nào, làn da bạn có biểu hiện gì?',
    options: [
      {
        label: 'Đổ nhiều dầu bóng nhờn khắp toàn bộ khuôn mặt',
        description: 'Bề mặt da nhờn dính, phản chiếu ánh sáng rõ rệt',
        skinTypeScore: 'Da dầu'
      },
      {
        label: 'Căng rát, khô căng, có thể xuất hiện vảy bong tróc li ti',
        description: 'Cảm giác thiếu ẩm nghiêm trọng, da kém đàn hồi',
        skinTypeScore: 'Da khô'
      },
      {
        label: 'Vùng chữ T (trán, mũi, cằm) bóng dầu, hai bên má khô hoặc bình thường',
        description: 'Hai vùng da trên khuôn mặt có đặc tính khác biệt',
        skinTypeScore: 'Da hỗn hợp'
      },
      {
        label: 'Dễ ửng đỏ, ngứa ngáy hoặc châm chích khó chịu',
        description: 'Hàng rào bảo vệ da yếu, nhạy cảm với môi trường xung quanh',
        skinTypeScore: 'Da nhạy cảm'
      }
    ]
  },
  {
    id: 2,
    question: 'Tình trạng lỗ chân lông và vấn đề về mụn trên da của bạn hiện tại?',
    options: [
      {
        label: 'Lỗ chân lông to, liên tục có mụn viêm, mụn mủ hoặc mụn ẩn',
        description: 'Tuyến bã nhờn hoạt động quá mức gây bít tắc nang lông',
        skinTypeScore: 'Da mụn'
      },
      {
        label: 'Lỗ chân lông to tập trung vùng mũi/má, có mụn cám, mụn đầu đen',
        description: 'Dễ bị bít tắc nhẹ nhưng ít bị mụn viêm nang nặng',
        skinTypeScore: 'Da dầu'
      },
      {
        label: 'Lỗ chân lông rất nhỏ, da mờ sần sùi, xuất hiện đường vân khô',
        description: 'Da thiếu hụt lipid và độ ẩm tự nhiên kéo dài',
        skinTypeScore: 'Da khô'
      },
      {
        label: 'Mao mạch nổi rõ dưới da, dễ nổi mẩn ngứa khi dùng mỹ phẩm mới',
        description: 'Rất dễ dị ứng, phản ứng mạnh với hương liệu và cồn',
        skinTypeScore: 'Da nhạy cảm'
      }
    ]
  },
  {
    id: 3,
    question: 'Mục tiêu cải thiện làn da ưu tiên hàng đầu của bạn trong 3 tháng tới?',
    options: [
      {
        label: 'Kiềm dầu triệt để, gom cồi mụn và giảm mụn sưng viêm',
        description: 'Làm sạch sâu nang lông, kháng khuẩn và dịu nốt mụn',
        skinTypeScore: 'Da mụn',
        concern: 'Trị mụn & Kiểm soát bã nhờn'
      },
      {
        label: 'Làm mờ thâm mụn, dưỡng sáng đều màu và thu nhỏ lỗ chân lông',
        description: 'Tái tạo bề mặt da mịn màng, rạng rỡ và căng bóng',
        skinTypeScore: 'Da hỗn hợp',
        concern: 'Làm sáng & Mờ thâm mụn'
      },
      {
        label: 'Cấp nước tầng sâu, làm đầy rãnh nhăn và chấm dứt bong tróc',
        description: 'Nuôi dưỡng làn da căng mọng, ngậm nước từ bên trong',
        skinTypeScore: 'Da khô',
        concern: 'Cấp ẩm chuyên sâu & Chống khô nẻ'
      },
      {
        label: 'Phục hồi hàng rào màng ẩm, làm dịu da đỏ rát và nhạy cảm',
        description: 'Tái thiết lập sức đề kháng tự nhiên của da khỏe mạnh',
        skinTypeScore: 'Da nhạy cảm',
        concern: 'Phục hồi màng ẩm bảo vệ'
      }
    ]
  }
];

class SkinQuizModel {
  private currentStep: number = 0;
  private answers: number[] = [];
  private result: SkinQuizResult | null = null;
  private isOpen: boolean = false;
  private listeners: Set<(state: { step: number; isOpen: boolean; result: SkinQuizResult | null }) => void> = new Set();

  public subscribe(listener: (state: { step: number; isOpen: boolean; result: SkinQuizResult | null }) => void): () => void {
    this.listeners.add(listener);
    listener({ step: this.currentStep, isOpen: this.isOpen, result: this.result });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = { step: this.currentStep, isOpen: this.isOpen, result: this.result };
    this.listeners.forEach((l) => l(state));
  }

  public openQuiz(): void {
    this.isOpen = true;
    this.currentStep = 0;
    this.answers = [];
    this.result = null;
    this.notify();
    eventBus.logAction('Model', 'SkinQuizModel.openQuiz', 'Bắt đầu bài kiểm tra chẩn đoán tình trạng da');
  }

  public closeQuiz(): void {
    this.isOpen = false;
    this.notify();
    eventBus.logAction('Model', 'SkinQuizModel.closeQuiz', 'Đóng bài kiểm tra chẩn đoán');
  }

  public answerQuestion(optionIndex: number): void {
    this.answers[this.currentStep] = optionIndex;
    
    if (this.currentStep < QUIZ_QUESTIONS.length - 1) {
      this.currentStep++;
      this.notify();
    } else {
      this.calculateResult();
    }
  }

  public previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.notify();
    }
  }

  private calculateResult(): void {
    const scores: Record<SkinType, number> = {
      'Da dầu': 0,
      'Da khô': 0,
      'Da nhạy cảm': 0,
      'Da mụn': 0,
      'Da hỗn hợp': 0,
      'Mọi loại da': 0
    };

    const concerns: string[] = [];

    this.answers.forEach((optIdx, qIdx) => {
      const q = QUIZ_QUESTIONS[qIdx];
      const selected = q.options[optIdx];
      if (selected) {
        scores[selected.skinTypeScore] = (scores[selected.skinTypeScore] || 0) + 1;
        if (selected.concern) {
          concerns.push(selected.concern);
        }
      }
    });

    // Find highest score
    let primaryType: SkinType = 'Da hỗn hợp';
    let max = -1;
    for (const type of Object.keys(scores) as SkinType[]) {
      if (scores[type] > max) {
        max = scores[type];
        primaryType = type;
      }
    }

    const allProducts = productModel.getAll();

    // Select Morning Routine for this skin type
    const morningClean = allProducts.find((p) => p.category === 'Làm sạch' && (p.skinTypes.includes(primaryType) || p.skinTypes.includes('Mọi loại da'))) || allProducts[4];
    const morningToner = allProducts.find((p) => p.category === 'Toner & Nước cân bằng' && (p.skinTypes.includes(primaryType) || p.skinTypes.includes('Mọi loại da'))) || allProducts[2];
    const morningSerum = allProducts.find((p) => p.category === 'Serum & Tinh chất' && (p.skinTypes.includes(primaryType) || p.skinTypes.includes('Mọi loại da'))) || allProducts[1];
    const morningSunscreen = allProducts.find((p) => p.category === 'Chống nắng') || allProducts[0];

    const morningRoutine = [morningClean, morningToner, morningSerum, morningSunscreen].filter(Boolean) as Product[];

    // Select Evening Routine
    const nightMicellar = allProducts.find((p) => p.name.includes('Tẩy Trang')) || allProducts[6];
    const nightClean = morningClean;
    const nightTreat = allProducts.find((p) => (p.category === 'Đặc trị & Tẩy da chết' || p.category === 'Serum & Tinh chất') && p.routineType !== 'AM' && p.skinTypes.includes(primaryType)) || allProducts[5];
    const nightCream = allProducts.find((p) => p.category === 'Kem dưỡng ẩm' && (p.skinTypes.includes(primaryType) || p.skinTypes.includes('Mọi loại da'))) || allProducts[3];

    const eveningRoutine = [nightMicellar, nightClean, nightTreat, nightCream].filter(Boolean) as Product[];

    const tips: string[] = [];
    if (primaryType === 'Da dầu' || primaryType === 'Da mụn') {
      tips.push('Làm sạch kép (Double Cleansing) kỹ vào buổi tối bằng nước tẩy trang và gel rửa mặt dịu nhẹ.');
      tips.push('Không lạm dụng giấy thấm dầu quá 3 lần/ngày vì có thể kích thích tuyến bã nhờn tiết nhiều dầu hơn.');
      tips.push('Bắt buộc dùng kem chống nắng mỏng nhẹ ráo mặt mỗi sáng để ngừa thâm mụn.');
    } else if (primaryType === 'Da khô') {
      tips.push('Hạn chế rửa mặt bằng nước quá nóng làm mất lớp màng lipid bảo vệ.');
      tips.push('Khóa ẩm bằng kem dưỡng chứa Ceramide hoặc Hyaluronic Acid đa tầng ngay khi da còn hơi ẩm.');
      tips.push('Uống đủ 2 - 2.5 lít nước mỗi ngày và hạn chế tiếp xúc máy lạnh khô.');
    } else {
      tips.push('Luôn kiểm tra thử sản phẩm mới (Patch test) ở vùng xương quai hàm trong 24 giờ trước khi dùng cả mặt.');
      tips.push('Ưu tiên công thức không hương liệu (fragrance-free), không cồn khô, nồng độ hoạt chất vừa phải.');
      tips.push('Tập trung phục hồi hàng rào ẩm bằng B5 và Rau Má trước khi dùng các chất treatment mạnh.');
    }

    this.result = {
      primarySkinType: primaryType,
      concerns: concerns.length ? concerns : ['Cân bằng & Phục hồi toàn diện'],
      recommendedRoutine: {
        morning: morningRoutine,
        evening: eveningRoutine
      },
      tips
    };

    this.notify();
    eventBus.logAction('Model', 'SkinQuizModel.calculateResult', `Phân tích thành công: ${primaryType} - Đề xuất routine gồm ${morningRoutine.length + eveningRoutine.length} sản phẩm`);
  }

  public reset(): void {
    this.currentStep = 0;
    this.answers = [];
    this.result = null;
    this.notify();
  }
}

export const skinQuizModel = new SkinQuizModel();
