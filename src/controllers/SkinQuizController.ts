import { skinQuizModel } from '../models/SkinQuizModel';
import { cartController } from './CartController';
import { Product } from '../types';
import { eventBus } from '../models/EventBus';

class SkinQuizController {
  public openQuiz(): void {
    skinQuizModel.openQuiz();
    eventBus.logAction('Controller', 'SkinQuizController.openQuiz', 'Khởi tạo bài trắc nghiệm tư vấn da');
  }

  public closeQuiz(): void {
    skinQuizModel.closeQuiz();
  }

  public selectOption(optionIndex: number): void {
    skinQuizModel.answerQuestion(optionIndex);
  }

  public goBack(): void {
    skinQuizModel.previousStep();
  }

  public addFullRoutine(products: Product[]): void {
    cartController.addRoutineToCart(products);
    skinQuizModel.closeQuiz();
  }

  public restartQuiz(): void {
    skinQuizModel.reset();
  }
}

export const skinQuizController = new SkinQuizController();
